import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Modal } from "react-native";
import AddMedicationModal from "./AddMedicineModal";
import { db, doc, updateDoc } from "../utils/firebase";
import { arrayRemove } from "firebase/firestore";

interface Schedule {
  time: string;
  dosage: string;
  withFood: boolean;
}

interface TimePeriod {
  from: string;
  to: string;
}

interface Medication {
  id: string;
  name: string;
  strength: string;
  condition: string;
  instructions: string;
  schedule: Schedule[];
  startDate: string;
  endDate: string;
  timePeriod: TimePeriod;
  sideEffects: string[];
  interactions: string[];
}

interface Patient {
  profile: {
    name: string;
    [key: string]: any;
  };
  id: string;
  medicines: Medication[];
}

interface MedicationComponentProps {
  patient: Patient;
  setSelectedPatient: React.Dispatch<React.SetStateAction<Patient | null>>;
}

const MedicationComponent: React.FC<MedicationComponentProps> = ({ patient, setSelectedPatient }) => {
  const [medications, setMedications] = useState<Medication[]>(patient.medicines || []);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    setMedications(patient.medicines || []);
  }, [patient]);

  const deleteMedication = (medicationId: string) => {
    Alert.alert("Delete Medication", "Are you sure you want to delete this medication?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const medicationToDelete = medications.find((med) => med.id === medicationId);
            if (!medicationToDelete) return;

            const userDocRef = doc(db, "patients", patient.id);
            await updateDoc(userDocRef, {
              medicines: arrayRemove(medicationToDelete),
            });

            const updatedMeds = medications.filter((med) => med.id !== medicationId);
            setMedications(updatedMeds);
            setSelectedPatient((prev) => (prev ? { ...prev, medicines: updatedMeds } : prev));

            Alert.alert("Success", "Medication deleted successfully!");
          } catch (error) {
            console.error("Error deleting medication:", error);
            Alert.alert("Error", "Failed to delete medication.");
          }
        },
      },
    ]);
  };

  const addMedication = (medication: Medication) => {
    setMedications([...medications, medication]);
    setSelectedPatient((prev) => (prev ? { ...prev, medicines: [...medications, medication] } : prev));
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.styledBackButtonText} onPress={() => setSelectedPatient(null)}>
          <Text style={styles.styledBackButtonText}>⬅</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Medications for {patient.profile.name}</Text>
      </View>
      {medications.length === 0 ? <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No medications available</Text>
      </View> :
        <FlatList
          data={medications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.medContainer}>
              <View style={styles.medHeader}>
                <Text style={styles.medTitle}>{item.name}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => deleteMedication(item.id)} style={styles.deleteButton}>
                    <Text style={styles.actionText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.info}>💊 Strength: {item.strength}</Text>
              <Text style={styles.info}>🩺 Condition: {item.condition}</Text>
              <Text style={styles.info}>📄 Instructions: {item.instructions}</Text>
              <Text style={styles.info}>📆 Start Date: {item.startDate}</Text>
              <Text style={styles.info}>📅 End Date: {item.endDate}</Text>
            </View>
          )}
        />}

      <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <AddMedicationModal
          onSave={addMedication}
          onCancel={() => setIsModalVisible(false)}
          patientId={patient.id}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    flexWrap: 'wrap',
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  medContainer: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  medHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  medTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00796b",
  },
  actions: {
    flexDirection: "row",
  },
  deleteButton: {
    backgroundColor: "#F44336",
    padding: 5,
    borderRadius: 5,
    marginLeft: 8,
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
  },
  info: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#007BFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  styledBackButtonText: {
    color: "#000",
    fontSize: 36,
    fontWeight: "bold",
    marginRight: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
    fontStyle: "italic",
  },
});

export default MedicationComponent;
