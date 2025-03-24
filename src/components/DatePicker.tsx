import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Button } from "react-native";
import RNPickerSelect from "react-native-picker-select";

interface Month {
  label: string;
  value: number;
}

interface CalendarPickerModalProps {
  onDateSelected: (date: string) => void;
  visible: boolean;
  onClose: () => void;
}

const CalendarPickerModal: React.FC<CalendarPickerModalProps> = ({ onDateSelected, visible, onClose }) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const years: number[] = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);
  const months: Month[] = [
    { label: "January", value: 0 },
    { label: "February", value: 1 },
    { label: "March", value: 2 },
    { label: "April", value: 3 },
    { label: "May", value: 4 },
    { label: "June", value: 5 },
    { label: "July", value: 6 },
    { label: "August", value: 7 },
    { label: "September", value: 8 },
    { label: "October", value: 9 },
    { label: "November", value: 10 },
    { label: "December", value: 11 },
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);

  const getDaysInMonth = (year: number, month: number): number =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (year: number, month: number): number =>
    new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const firstDayIndex = getFirstDayOfMonth(selectedYear, selectedMonth);

  const calendarDays = [
    ...Array(firstDayIndex).fill(""),
    ...Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString()),
  ];

  const handleDatePress = (day: string) => {
    if (day) {
      const formattedMonth = String(selectedMonth + 1).padStart(2, "0");
      const formattedDay = day.padStart(2, "0");
      const selectedFullDate = `${selectedYear}-${formattedMonth}-${formattedDay}`;
      onDateSelected(selectedFullDate);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.calendarContainer}>
          <Text style={styles.title}>Select a Date</Text>
          
          <View style={styles.pickerRow}>
            <RNPickerSelect
              onValueChange={(value) => setSelectedYear(value)}
              items={years.map((year) => ({ label: `${year}`, value: year }))}
              placeholder={{ label: "Select Year", value: null }}
              value={selectedYear}
              style={pickerSelectStyles}
            />
            <RNPickerSelect
              onValueChange={(value) => setSelectedMonth(value)}
              items={months}
              placeholder={{ label: "Select Month", value: null }}
              value={selectedMonth}
              style={pickerSelectStyles}
            />
          </View>

          <View style={styles.weekRow}>
            {daysOfWeek.map((day) => (
              <Text key={day} style={styles.weekDay}>{day}</Text>
            ))}
          </View>

          <FlatList
            data={calendarDays}
            keyExtractor={(item, index) => index.toString()}
            numColumns={7}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.dateItem, item === "" && styles.emptyItem]}
                onPress={() => handleDatePress(item)}
              >
                <Text style={styles.dateText}>{item}</Text>
              </TouchableOpacity>
            )}
          />

          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  calendarContainer: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  weekDay: {
    width: 40,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
  },
  dateItem: {
    width: 32,
    height: 32,
    margin: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  emptyItem: {
    backgroundColor: "transparent",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "black",
    width: 140,
    padding: 8,
  },
  inputAndroid: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    color: "black",
    width: 140,
    padding: 8,
  },
};

export default CalendarPickerModal;
