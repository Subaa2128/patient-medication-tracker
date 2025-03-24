import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import MedicineDetailsModal from './ViewMedicineSchedule';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, doc, getDoc } from '../utils/firebase';

interface Schedule {
  time?: string;
  dosage: string;
  withFood?: boolean;
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
  startDate?: string;
  endDate?: string;
}

interface IMedicineSchedule {
  selectedDate: string;
}

const MedicineSchedule: React.FC<IMedicineSchedule> = ({ selectedDate }) => {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState({})
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const storedUser = await AsyncStorage.getItem('loggedInUser');

        if (storedUser) {
          const { username } = JSON.parse(storedUser);
          const userDoc = await getDoc(doc(db, 'patients', username));

          if (userDoc.exists()) {
            const userProfile = userDoc.data();
            setProfileData(userProfile);
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

  const isDateInRange = (selectedDate: string, startDate?: string, endDate?: string): boolean => {
    if (!startDate || !endDate) return true;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const selected = new Date(selectedDate);

    return selected >= start && selected <= end;
  };

  const renderMedicine = ({ item }: { item: Medicine }) => (
    <View>
      {item.schedule.map((schedule, index) => (
        <View key={index} style={styles.scheduleBox}>
          <View style={styles.header}>
            <Text style={styles.periodText}>{schedule.time ? 'Scheduled' : 'As Needed'}</Text>
            {schedule.time && <Text style={styles.timeText}>{schedule.time}</Text>}
          </View>

          <View style={styles.content}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2921/2921807.png' }}
              style={styles.medicineImage}
            />
            <View style={styles.details}>
              <Text style={styles.medicineName}>{item.name}</Text>
              <Text style={styles.medicineInfo}>{schedule.dosage} {schedule.withFood ? '| With Food' : ''}</Text>
            </View>

            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => [setSelectedMedicine(item), setSelectedSchedule(schedule)]}
            >
              <Text style={styles.viewButtonText}>VIEW</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const filteredMedicines = profileData?.medicines?.filter((medicine: Medicine) =>
    isDateInRange(selectedDate, medicine.startDate, medicine.endDate)
  );

  return (
    <View style={{ margin: 10 }}>
      <Text style={styles.title}>Medicine Schedule</Text>

      <View style={[{ height: 400 }, styles.medicineCard]}>
        {loading ? (
          <Text>Loading...</Text>
        ) : filteredMedicines && filteredMedicines.length > 0 ? (
          <FlatList
            data={filteredMedicines || []}
            renderItem={renderMedicine}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No medicines available for the selected date.</Text>
          </View>
        )}
      </View>

      <MedicineDetailsModal
        visible={!!selectedMedicine}
        medicine={selectedMedicine}
        onClose={() => setSelectedMedicine(null)}
        schedule={selectedSchedule}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  listContainer: { paddingBottom: 20 },
  scheduleBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 0.2,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  periodText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  timeText: { fontSize: 14, color: '#666' },
  content: { flexDirection: 'row', alignItems: 'center' },
  medicineImage: { width: 40, height: 40, marginRight: 10 },
  details: { flex: 1 },
  medicineName: { fontSize: 16, fontWeight: 'bold', color: '#444' },
  medicineInfo: { fontSize: 14, color: '#666', marginTop: 2 },
  viewButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  viewButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  medicineCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default MedicineSchedule;
