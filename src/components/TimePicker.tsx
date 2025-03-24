import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface TimePickerProps {
  onTimeSelect: (time: string) => void;
  title: string
}

const TimePickerComponent: React.FC<TimePickerProps> = ({ onTimeSelect, title }) => {
  const [selectedHour, setSelectedHour] = useState("12");
  const [selectedMinute, setSelectedMinute] = useState("00");

  const handleTimeChange = (hour: string, minute: string) => {
    const formattedTime = `${hour}:${minute}`;
    onTimeSelect(formattedTime);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{title}:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedHour}
          onValueChange={(value) => {
            setSelectedHour(value);
            handleTimeChange(value, selectedMinute);
          }}
          style={styles.picker}
        >
          {Array.from({ length: 24 }, (_, i) => (
            <Picker.Item key={i} label={i.toString().padStart(2, "0")} value={i.toString().padStart(2, "0")} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedMinute}
          onValueChange={(value) => {
            setSelectedMinute(value);
            handleTimeChange(selectedHour, value);
          }}
          style={styles.picker}
        >
          {Array.from({ length: 60 }, (_, i) => (
            <Picker.Item key={i} label={i.toString().padStart(2, "0")} value={i.toString().padStart(2, "0")} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: 'row',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
  },
  picker: {
    height: 50,
    width: 80,
  },
});

export default TimePickerComponent;
