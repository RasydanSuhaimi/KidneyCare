// MealPicker.js
import React from "react";
import { Modal, View, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";

const MealPicker = ({
  modalVisible,
  setModalVisible,
  mealType,
  setMealType,
}) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View className="flex-1 justify-center items-center shadow">
        <View className="bg-white bg-opacity-70 rounded-lg w-80 p-5">
          <Picker
            selectedValue={mealType}
            onValueChange={(itemValue) => {
              setMealType(itemValue);
              setModalVisible(false);
            }}
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

export default MealPicker;
