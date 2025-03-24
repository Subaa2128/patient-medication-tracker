import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from "react-native";
import { getUsers } from "../../utils/function";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MedicationComponent from "../../components/PatientsMedication";

const Home: React.FC = () => {
  const [doctorPatients, setDoctorPatients] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const storedProfile = await AsyncStorage.getItem("loggedInUser");
      if (storedProfile) setProfileData(JSON.parse(storedProfile));
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedUsers = await getUsers();
      if (Array.isArray(fetchedUsers) && profileData) {
        const matchedPatients = fetchedUsers.filter((user: any) =>
          profileData.patients.includes(user.username)
        );
        setDoctorPatients(matchedPatients);
      }
    };

    if (profileData) fetchData();
  }, [profileData]);

  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient);
  };

  return (
    <View style={styles.container}>
      {!selectedPatient ? (
        <View style={{ padding: 20 }}>
          <Text style={styles.title}>Patient List</Text>
          <FlatList
            data={doctorPatients}
            keyExtractor={(item) => item.username}
            renderItem={({ item }) => (
              <View style={styles.cardContainer}>
                <View style={styles.card}>
                  <Image
                    source={{
                      uri: item.profile?.image || "https://via.placeholder.com/80",
                    }}
                    style={styles.patientImage}
                  />
                  <View style={styles.detailsContainer}>
                    <Text style={styles.patientName}>{item.profile?.name}</Text>
                    <Text>Email: {item.profile?.email}</Text>
                    <Text>Phone: {item.profile?.phone}</Text>
                    <Text>Address: {item.profile?.address}</Text>
                    <Text>Weight: {item.profile?.weight}</Text>
                    <Text>Height: {item.profile?.height}</Text>
                    <Text>Gender: {item.profile?.gender}</Text>
                    <TouchableOpacity
                      style={styles.viewButton}
                      onPress={() => handlePatientSelect(item)}
                    >
                      <Text style={styles.viewButtonText}>View Profile</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      ) : (
        <MedicationComponent
          patient={selectedPatient}
          setSelectedPatient={setSelectedPatient}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    alignSelf: "center",
  },
  cardContainer: {
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "#fff",
    padding: 15,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
  },
  patientImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  detailsContainer: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#444",
  },
  viewButton: {
    marginTop: 10,
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  viewButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Home;
