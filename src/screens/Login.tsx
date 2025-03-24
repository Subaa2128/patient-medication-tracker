import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Modal, StyleSheet, Button } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDoctors, getUsers } from '../utils/function';
import { useAuthStore } from '../store/authStore';

interface LoginModalProps {
  isVisible: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const ValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Please enter your email address'),
  password: Yup.string().required('Please enter your password'),
});

const LoginModal: React.FC<LoginModalProps> = ({ isVisible, onClose, onLoginSuccess }) => {
  const [authError, setAuthError] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const { setUserType, setIsLoggedIn } = useAuthStore()
  useEffect(() => {
    const fetchData = async () => {
      const fetchedUsers = await getUsers();
      const fetchedDoctors = await getDoctors();

      setUsers(fetchedUsers);
      setDoctors(fetchedDoctors);
    };

    fetchData();
  }, []);

  const handleLogin = async (values: { email: string; password: string }) => {
    const matchedPatient = users.find(
      (patient) => patient.profile.email === values.email && patient.password === values.password
    );

    console.log(matchedPatient)

    const matchedDoctor = doctors.find(
      (doctor) => doctor.email === values.email && doctor.password === values.password
    );
    console.log(matchedDoctor)

    if (matchedPatient) {
      setAuthError('');
      await AsyncStorage.setItem('loggedInUser', JSON.stringify({ ...matchedPatient, userType: 'patient' }));
      setUserType('patients');
      setIsLoggedIn(true)
      onLoginSuccess();
      onClose();
    } else if (matchedDoctor) {
      setAuthError('');
      await AsyncStorage.setItem('loggedInUser', JSON.stringify({ ...matchedDoctor, userType: 'doctor' }));
      setIsLoggedIn(true)
      setUserType('doctors');
      onLoginSuccess();
      onClose();
    } else {
      setAuthError('Incorrect email or password. Please try again.');
    }
  };


  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.container}>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={ValidationSchema}
          onSubmit={handleLogin}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <View style={styles.loginWrapper}>
              <Text style={styles.title}>Login</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
              />
              {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                secureTextEntry
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
              />
              {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

              {authError !== '' && <Text style={styles.authError}>{authError}</Text>}

              <Button title="Login" onPress={() => handleLogin(values)} />
            </View>
          )}
        </Formik>
      </View>
    </Modal>
  );
};

export default LoginModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  loginWrapper: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  authError: {
    color: 'red',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 15,
  },
  closeText: {
    color: 'blue',
  },
});
