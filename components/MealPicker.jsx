import React from "react";
import { Modal, View, Button, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

const MealPicker = ({ modalVisible, setModalVisible, mealType, setMealType }) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={mealType}
            onValueChange={(itemValue) => {
              setMealType(itemValue);
              setModalVisible(false);
            }}
            style={styles.picker} 
            dropdownIconColor="#007AFF" 
            itemStyle={styles.pickerItem} 
          >
            <Picker.Item label="Breakfast" value="Breakfast" />
            <Picker.Item label="Lunch" value="Lunch" />
            <Picker.Item label="Dinner" value="Dinner" />
            <Picker.Item label="Snack" value="Snack" />
          </Picker>
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pickerContainer: {
    backgroundColor: "#F7F7F7", 
    borderRadius: 10,
    width: "80%",
    padding: 20,
    elevation: 5, 
  },
  picker: {
    height: 150, 
    width: "100%",
  },
  pickerItem: {
    color: "#007AFF", 
    fontSize: 16, 
  },
});

export default MealPicker;
