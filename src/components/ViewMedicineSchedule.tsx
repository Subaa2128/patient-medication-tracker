import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';

interface Schedule {
  time?: string;
  dosage?: string;
  withFood?: boolean;
  asNeeded?: boolean;
  maxDaily?: number;
  minTimeBetween?: number;
  specialInstructions?: string;
}

interface Medicine {
  id: string;
  name: string;
  strength: string;
  condition: string;
  instructions: string;
  schedule: Schedule[];
  sideEffects: string[];
  interactions: string[];
}

interface ModalProps {
  visible: boolean;
  medicine: Medicine | null;
  onClose: () => void;
  schedule: Schedule
}

const MedicineDetailsModal: React.FC<ModalProps> = ({ visible, medicine, onClose, schedule }) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {medicine && (
            <>
              <Text style={styles.modalTitle}>{medicine.name}</Text>
              <Text style={styles.modalSubTitle}>Strength: {medicine.strength}</Text>
              <Text style={styles.modalText}>Condition: {medicine.condition}</Text>
              <Text style={styles.modalText}>Instructions: {medicine.instructions}</Text>

              <Text style={styles.modalSectionTitle}>Schedule:</Text>
              <View style={styles.scheduleItem}>
                {schedule.time && <Text style={styles.scheduleText}>Time: {schedule.time}</Text>}
                <Text style={styles.scheduleText}>Dosage: {schedule.dosage}</Text>
                {schedule.withFood !== undefined && (
                  <Text style={styles.scheduleText}>With Food: {schedule.withFood ? 'Yes' : 'No'}</Text>
                )}
                {schedule.specialInstructions && (
                  <Text style={styles.scheduleText}>Special Instructions: {schedule.specialInstructions}</Text>
                )}
              </View>

              <Text style={styles.modalSectionTitle}>Side Effects:</Text>
              {medicine.sideEffects.length > 0 ? (
                medicine.sideEffects.map((effect, idx) => (
                  <Text key={idx} style={styles.modalText}>- {effect}</Text>
                ))
              ) : (
                <Text style={styles.modalText}>No side effects listed.</Text>
              )}

              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    maxHeight: '80%',
    alignItems: 'flex-start',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modalSubTitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginTop: 6,
    marginBottom: 6,
  },
  scheduleContainer: {
    marginBottom: 12,
    width: '100%',
  },
  scheduleItem: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  scheduleText: {
    fontSize: 14,
    color: '#555',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MedicineDetailsModal;
