import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../utils/firebase";
import TimePickerComponent from "./TimePicker";
import CalendarPickerModal from "./DatePicker";

interface Schedule {
    time: string;
    dosage: string;
    withFood: boolean;
    taken: null,
    skipped: null,
}

interface Medication {
    id: string;
    name: string;
    strength: string;
    condition: string;
    instructions: string;
    startDate: string;
    endDate: string;
    schedule: Schedule[];
}

interface AddMedicationModalProps {
    patientId: string;
    onSave: (medication: any) => void;
    onCancel: () => void;
}

const AddMedicationModal: React.FC<AddMedicationModalProps> = ({ patientId, onSave, onCancel }) => {
    const [newMed, setNewMed] = useState<Partial<Medication>>({ schedule: [] });
    const [selectedTime, setSelectedTime] = useState<string>("12:00");
    const [fromTimePerio, setFromTimePeriod] = useState<string>("12:00");
    const [toTimePerio, setToTimePeriod] = useState<string>("12:00");
    const [sideEffect, setSideEffect] = useState<string>("");
    const [sideEffects, setSideEffects] = useState<string[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState(false); // Loading state
    const [dosage, setDosage] = useState<string>("");
    const [withFood, setWithFood] = useState<boolean>(false);
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [selectedDateField, setSelectedDateField] = useState<"startDate" | "endDate" | null>(null);
    const [interaction, setInteraction] = useState("");
    const [interactions, setInteractions] = useState(["NSAIDs", "Potassium supplements"]);
    const [isinteractionsEditing, setinteractionsIsEditing] = useState(false);
    const [editinteractionsIndex, setEditinteractionsIndex] = useState<number | null>(null);
    const [startDate, setStartDate] = useState('')
    const addInteraction = () => {
        if (interaction.trim() === "") return;

        if (isinteractionsEditing && editinteractionsIndex !== null) {
            const updatedInteractions = [...interactions];
            updatedInteractions[editinteractionsIndex] = interaction;
            setInteractions(updatedInteractions);
            setinteractionsIsEditing(false);
            setEditinteractionsIndex(null);
        } else {
            setInteractions([...interactions, interaction]);
        }

        setInteraction("");
    };

    const editInteraction = (index: number) => {
        setInteraction(interactions[index]);
        setinteractionsIsEditing(true);
        setEditinteractionsIndex(null);
    };

    const deleteInteraction = (index: number) => {
        setInteractions(interactions.filter((_, i) => i !== index));
        if (isinteractionsEditing && editinteractionsIndex === index) {
            setinteractionsIsEditing(false);
            setInteraction("");
            setEditinteractionsIndex(null);
        }
    };
    const handleDateSelect = (date: string) => {
        if (selectedDateField) {
            setNewMed({ ...newMed, [selectedDateField]: date });
        }
        setIsCalendarVisible(false);
        setSelectedDateField(null);
    };

    const addSchedule = () => {
        if (selectedTime && dosage) {
            const newSchedule: Schedule = {
                time: selectedTime, dosage, withFood, taken: null,
                skipped: null,
            };
            setNewMed({
                ...newMed,
                schedule: [...(newMed.schedule || []), newSchedule],
            });
            setDosage("");
            setWithFood(false);
        } else {
            Alert.alert("Error", "Please provide time and dosage.");
        }
    };

    const addSideEffect = () => {
        if (sideEffect.trim() !== "") {
            if (isEditing && editIndex !== null) {
                const updatedSideEffects = [...sideEffects];
                updatedSideEffects[editIndex] = sideEffect;
                setSideEffects(updatedSideEffects);
                setIsEditing(false);
                setEditIndex(null);
            } else {
                setSideEffects([...sideEffects, sideEffect]);
            }
            setSideEffect("");
        } else {
            Alert.alert("Error", "Please enter a side effect.");
        }
    };

    const editSideEffect = (index: number) => {
        setSideEffect(sideEffects[index]);
        setIsEditing(true);
        setEditIndex(index);
    };

    const deleteSideEffect = (index: number) => {
        const updatedSideEffects = sideEffects.filter((_, i) => i !== index);
        setSideEffects(updatedSideEffects);
    };


    const handleSave = async () => {
        if (
            newMed.name &&
            newMed.strength &&
            newMed.condition &&
            newMed.instructions &&
            newMed.schedule &&
            newMed.schedule.length > 0 &&
            sideEffects.length > 0 &&
            interactions.length > 0
        ) {
            const medication: Medication = {
                id: `med${Date.now()}`,
                name: newMed.name,
                strength: newMed.strength,
                condition: newMed.condition,
                instructions: newMed.instructions,
                startDate: newMed.startDate || new Date().toISOString().split("T")[0],
                endDate: newMed.endDate || new Date().toISOString().split("T")[0],
                schedule: newMed.schedule,
            };

            const medicationData = {
                ...medication,

                sideEffects,
                interactions,
            };
            setLoading(true);
            try {
                const userDocRef = doc(db, "patients", patientId);
                await updateDoc(userDocRef, {
                    medicines: arrayUnion(medicationData),
                });

                onSave(medicationData);
                onCancel();
                Alert.alert("Success", "Medication added successfully!");
                setLoading(false);
            } catch (error) {
                Alert.alert("Error", "Failed to add medication!");
                console.error("Firebase Error:", error);
            }
        } else {
            Alert.alert("Error", "Please complete all fields before saving!");
        }
    };


    return (


        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <Text style={styles.title}>Add Medication</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={newMed.name}
                        onChangeText={(text) => setNewMed({ ...newMed, name: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Strength"
                        value={newMed.strength}
                        onChangeText={(text) => setNewMed({ ...newMed, strength: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Condition"
                        value={newMed.condition}
                        onChangeText={(text) => setNewMed({ ...newMed, condition: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Instructions"
                        value={newMed.instructions}
                        onChangeText={(text) => setNewMed({ ...newMed, instructions: text })}
                    />
                    <TouchableOpacity
                        style={styles.input}
                        onPress={() => {
                            setSelectedDateField("startDate");
                            setIsCalendarVisible(true);
                        }}
                    >
                        <Text>{newMed.startDate || "Select Start Date"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.input}
                        onPress={() => {
                            setSelectedDateField("endDate");
                            setIsCalendarVisible(true);
                        }}
                    >
                        <Text>{newMed.endDate || "Select End Date"}</Text>
                    </TouchableOpacity>
                    <CalendarPickerModal onClose={() => setIsCalendarVisible(false)} onDateSelected={handleDateSelect} visible={isCalendarVisible} />

                    <Text style={styles.subTitle}>Add Schedule</Text>

                    <TimePickerComponent onTimeSelect={setSelectedTime} title="Select Time" />
                    <TextInput
                        style={styles.input}
                        placeholder="Dosage"
                        value={dosage}
                        onChangeText={setDosage}
                    />
                    <TouchableOpacity onPress={() => setWithFood(!withFood)} style={styles.checkbox}>
                        <Text>{withFood ? "✔️" : "◻️"} With Food</Text>
                    </TouchableOpacity>
                    <Button title="Add Schedule" onPress={addSchedule} />

                    {newMed.schedule && newMed.schedule.length > 0 && (
                        <View style={styles.scheduleList}>
                            <Text style={styles.subTitle}>Schedules:</Text>
                            {newMed.schedule.map((item, index) => (
                                <Text key={index} style={styles.scheduleItem}>
                                    {item.time} - {item.dosage} {item.withFood ? "(With Food)" : "(Without Food)"}
                                </Text>
                            ))}
                        </View>
                    )}

                    <View>
                        <Text style={styles.subTitle}>Side Effects</Text>

                        <View style={styles.sideEffectInputContainer}>
                            <TextInput
                                style={styles.sideEffectInput}
                                placeholder="Enter side effect"
                                value={sideEffect}
                                onChangeText={setSideEffect}
                            />
                            <Button
                                title={isEditing ? "Update" : "Add"}
                                onPress={addSideEffect}
                            />
                        </View>

                        {sideEffects.length > 0 && (
                            <View style={styles.sideEffectList}>
                                {sideEffects.map((effect, index) => (
                                    <View key={index} style={styles.sideEffectItemContainer}>
                                        <Text style={styles.sideEffectItem}>{effect}</Text>
                                        <View style={styles.actionButtons}>
                                            <TouchableOpacity onPress={() => editSideEffect(index)}>
                                                <Text style={styles.editButton}>✏️</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => deleteSideEffect(index)}>
                                                <Text style={styles.deleteButton}>🗑️</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                    <View><Text style={styles.subTitle}>Manage Interactions</Text>
                        <View style={styles.sideEffectInputContainer}>
                            <TextInput
                                style={styles.sideEffectInput}
                                placeholder="Enter interaction"
                                value={interaction}
                                onChangeText={setInteraction}
                            />
                            <Button
                                title={isEditing ? "Update" : "Add"}
                                onPress={addInteraction}
                            />
                        </View>
                        {interactions.map((item, index) => (
                            <View key={index} style={styles.sideEffectItemContainer}>
                                <Text style={styles.sideEffectItem}>{item}</Text>
                                <View style={styles.actionButtons}>
                                    <TouchableOpacity onPress={() => editInteraction(index)}>
                                        <Text style={styles.editButton}>✏️</Text>            </TouchableOpacity>
                                    <TouchableOpacity onPress={() => deleteInteraction(index)}>
                                        <Text style={styles.deleteButton}>🗑️</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}</View>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <Button title="Save" onPress={handleSave} disabled={loading} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Button title="Cancel" onPress={onCancel} color="red" />
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        width: "90%",
        height: "80%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    title: {
        fontSize: 20,
        marginBottom: 15,
        fontWeight: "bold",
    },
    subTitle: {
        fontSize: 16,
        marginVertical: 10,
        fontWeight: "bold",
    },
    input: {
        borderWidth: 1,
        marginBottom: 10,
        padding: 8,
        borderRadius: 5,
        borderColor: "#ccc",
    },
    checkbox: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    scheduleList: {
        marginTop: 10,
    },
    scheduleItem: {
        fontSize: 14,
        marginBottom: 5,
        color: "#555",
    },
    sideEffectInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    sideEffectInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 8,
        marginRight: 10,
    },
    sideEffectList: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: "#f9f9f9",
        borderRadius: 5,
    },
    sideEffectItemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5,
    },
    sideEffectItem: {
        fontSize: 14,
        color: "#333",
    },
    actionButtons: {
        flexDirection: "row",
        gap: 10,
    },
    editButton: {
        color: "blue",
        fontSize: 16,
        marginRight: 10,
    },
    deleteButton: {
        color: "red",
        fontSize: 16,
    },
});


export default AddMedicationModal;
