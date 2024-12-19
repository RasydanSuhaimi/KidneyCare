// components/WaterModal.js
import React from "react";
import { Modal, View, Text, TextInput, Button, StyleSheet } from "react-native";

const WaterModal = ({ visible, onCancel, onSubmit, waterIntake, setWaterIntake }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Water Intake</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter water intake (ml)"
            keyboardType="numeric"
            value={waterIntake}
            onChangeText={setWaterIntake}
          />
          <View style={styles.modalButtons}>
            <Button title="Add" onPress={onSubmit} />
            <Button title="Cancel" color="red" onPress={onCancel} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default WaterModal;
