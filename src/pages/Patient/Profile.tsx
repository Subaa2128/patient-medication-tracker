import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { db, doc, getDoc, updateDoc } from '../../utils/firebase';
import LoadingScreen from '../../components/LoadingScreen';
import { useAuthStore } from '../../store/authStore';

const placeholderImage = 'https://via.placeholder.com/120';

type UserProfile = {
  username: string;
  password: string;
  profile: {
    name: string;
    email: string;
    phone: string;
    address: string;
    weight: string;
    height: string;
    gender: string;
    image: string | null;
  };
};

export default function ProfilePage() {
  const { userType, setIsLoggedIn } = useAuthStore();
  const [profileData, setProfileData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState<any | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    try {
      const fetchProfile = async () => {
        try {
          setLoading(true)
          const storedUser = await AsyncStorage.getItem('loggedInUser');
          if (storedUser) {
            const { username } = JSON.parse(storedUser);
            setUserId(username);
            const userDoc = await getDoc(doc(db, userType, username));

            if (userDoc.exists()) {
              const userProfile = userDoc.data() as UserProfile;
              setProfileData(userProfile);
              setEditableProfile(userProfile);
            }
          }
          setLoading(false)

        } catch (error) {
          console.error('Error fetching profile:', error);
        } finally {
          setLoading(false)
        }
      };

      fetchProfile();
    } catch (error) {
      console.log(error)
    }
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('loggedInUser');
              // Alert.alert('Logged Out', 'You have been logged out successfully.');
              setIsLoggedIn(false)
            } catch (error) {
              console.error('Error during logout:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      if (editableProfile && userId) {
        await updateDoc(doc(db, userType, userId), {
          profile: editableProfile.profile,
        });
        setProfileData(editableProfile);
        setIsEditing(false);
        Alert.alert('Profile Updated', 'Your profile has been updated successfully.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleInputChange = (field: keyof UserProfile['profile'], value: string) => {
    if (editableProfile) {
      setEditableProfile({
        ...editableProfile,
        profile: { ...editableProfile.profile, [field]: value },
      });
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: profileData?.profile.image || placeholderImage }}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editIcon} onPress={handleEditToggle}>
          <MaterialIcons name="edit" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Text style={styles.nameText}>{profileData?.profile.name}</Text>
      <Text style={styles.emailText}>{profileData?.profile.email}</Text>

      {isEditing ? (
        <>
          <TextInput
            style={styles.input}
            value={editableProfile?.profile.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            placeholder="Phone"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            value={editableProfile?.profile.address}
            onChangeText={(value) => handleInputChange('address', value)}
            placeholder="Address"
          />
          <TextInput
            style={styles.input}
            value={editableProfile?.profile.weight}
            onChangeText={(value) => handleInputChange('weight', value)}
            placeholder="Weight (kg)"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            value={editableProfile?.profile.height}
            onChangeText={(value) => handleInputChange('height', value)}
            placeholder="Height (cm)"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            value={editableProfile?.profile.gender}
            onChangeText={(value) => handleInputChange('gender', value)}
            placeholder="Gender"
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
          <View style={styles.detailRow}>
            <MaterialIcons name="phone" size={20} color="#aaa" />
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.infoText}>{profileData?.profile.phone || 'Not Provided'}</Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="home" size={20} color="#aaa" />
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.infoText}>{profileData?.profile.address || 'Not Provided'}</Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="fitness-center" size={20} color="#aaa" />
            <Text style={styles.label}>Weight:</Text>
            <Text style={styles.infoText}>{profileData?.profile.weight ? `${profileData?.profile.weight} kg` : 'Not Provided'}</Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="height" size={20} color="#aaa" />
            <Text style={styles.label}>Height:</Text>
            <Text style={styles.infoText}>{profileData?.profile.height ? `${profileData?.profile.height} cm` : 'Not Provided'}</Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="person" size={20} color="#aaa" />
            <Text style={styles.label}>Gender:</Text>
            <Text style={styles.infoText}>{profileData?.profile.gender || 'Not Provided'}</Text>
          </View>

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
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#aaa',
    backgroundColor: '#ddd',
  },
  editIcon: {
    position: 'absolute',
    right: -10,
    bottom: 10,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 20,
    elevation: 5,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  emailText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  input: {
    width: '85%',
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
  },
  infoText: {
    fontSize: 16,
    marginVertical: 5,
    color: '#444',
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

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingText: {
    marginTop: 50,
    fontSize: 18,
    color: '#666',
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
    marginLeft: 8,
    fontWeight: 'bold',
    color: '#333',
    width: 80,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#ff5722',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

});

