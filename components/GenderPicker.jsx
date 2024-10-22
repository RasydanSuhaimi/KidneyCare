import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const GenderPicker = ({ selectedGender, setSelectedGender }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempSelectedGender, setTempSelectedGender] = useState(selectedGender);

  const openPicker = () => {
    setTempSelectedGender(selectedGender || "Male"); // Set default gender when opening
    setModalVisible(true);
  };

  const closePicker = () => {
    setModalVisible(false);
  };

  const handleDone = () => {
    console.log("Selected Gender:", tempSelectedGender); // Log selected gender
    setSelectedGender(tempSelectedGender);
    closePicker();
  };

  return (
    <View>
      <TouchableOpacity style={styles.input} onPress={openPicker}>
        <Text
          style={[
            styles.inputText,
            { color: selectedGender ? "black" : "#7b7b8b" },
          ]}
        >
          {selectedGender || "Select Gender"}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closePicker}
      >
        <Pressable style={styles.modalOverlay} onPress={closePicker} />
        <View style={styles.modalContent}>
          <Picker
            selectedValue={tempSelectedGender}
            onValueChange={(itemValue) => setTempSelectedGender(itemValue)}
          >
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
          </Picker>

          <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "white",
    borderRadius: 100,
    height: 64,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "black",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  inputText: {
    flex: 1,
    fontWeight: "600",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  doneButton: {
    backgroundColor: "#8B7FF5",
    height: 50,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  doneButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default GenderPicker;
