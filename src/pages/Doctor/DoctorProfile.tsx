import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { db, doc, getDoc, updateDoc } from '../../utils/firebase';
import LoadingScreen from '../../components/LoadingScreen';
import { useAuthStore } from '../../store/authStore';

const placeholderImage = 'https://via.placeholder.com/120';

const DoctorProfile = () => {
  const { userType, setIsLoggedIn } = useAuthStore();
  const [profileData, setProfileData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState<any | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const storedUser = await AsyncStorage.getItem('loggedInUser');

        if (storedUser) {
          const { doctorId } = JSON.parse(storedUser);
          setUserId(doctorId);
          const userDoc = await getDoc(doc(db, 'doctors', doctorId));

          if (userDoc.exists()) {
            const userProfile = userDoc.data();
            setProfileData(userProfile);
            setEditableProfile(userProfile);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    Alert.alert('Logout Confirmation', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Confirm',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('loggedInUser');
            setIsLoggedIn(false);
          } catch (error) {
            console.error('Error during logout:', error);
          }
        },
      },
    ]);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      if (editableProfile && userId) {
        await updateDoc(doc(db, 'doctors', userId), editableProfile);
        setProfileData(editableProfile);
        setIsEditing(false);
        Alert.alert('Profile Updated', 'Your profile has been updated successfully.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditableProfile({ ...editableProfile, [field]: value });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: profileData?.image || placeholderImage }}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editIcon} onPress={handleEditToggle}>
          <MaterialIcons name="edit" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Text style={styles.nameText}>{profileData?.name}</Text>
      <Text style={styles.specializationText}>{profileData?.specialization}</Text>

      {isEditing ? (
        <>
          <TextInput
            style={styles.input}
            value={editableProfile?.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholder="Email"
          />
          <TextInput
            style={styles.input}
            value={editableProfile?.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            placeholder="Phone"
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            value={editableProfile?.address}
            onChangeText={(value) => handleInputChange('address', value)}
            placeholder="Address"
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleEditToggle}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Email: {profileData?.email}</Text>
          <Text style={styles.label}>Phone: {profileData?.phone}</Text>
          <Text style={styles.label}>Address: {profileData?.address}</Text>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  profileContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#aaa',
  },
  infoText: {
    fontSize: 16,
    marginVertical: 5,
    color: '#444',
  },
  editIcon: {
    position: 'absolute',
    right: -10,
    bottom: 10,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 20,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  specializationText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    width: '85%',
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
  },
  detailsContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    elevation: 4, // Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    paddingVertical: 4,
    borderBottomWidth: 0.8,
    borderBottomColor: '#ddd',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  patientHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  patientText: {
    fontSize: 16,
    marginVertical: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 8,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#ff5722',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DoctorProfile;
