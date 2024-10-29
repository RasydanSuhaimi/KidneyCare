import React, { useState } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  Platform,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AntDesign from "@expo/vector-icons/AntDesign";
import dayjs from "dayjs";

const MonthPicker = ({ selectedMonth, setSelectedMonth, setSelectedDate }) => {
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [tempSelectedDate, setTempSelectedDate] = useState(new Date());

  // Handle date change on Android
  const onMonthChangeAndroid = (event, date) => {
    setShowMonthPicker(false);
    if (date) {
      const newMonth = dayjs(date).format("YYYY-MM");
      setSelectedMonth(newMonth);
      setSelectedDate(dayjs(date).format("YYYY-MM-DD"));
    }
  };

  // Handle date change on iOS
  const onMonthChangeIOS = (event, date) => {
    if (date) {
      setTempSelectedDate(date);
    }
  };

  // Confirm date selection on iOS after "Done" button is pressed
  const handleConfirmDateIOS = () => {
    setShowMonthPicker(false);
    const newMonth = dayjs(tempSelectedDate).format("YYYY-MM");
    setSelectedMonth(newMonth);
    setSelectedDate(dayjs(tempSelectedDate).format("YYYY-MM-DD"));
  };

  const showDatePicker = () => {
    setShowMonthPicker(true);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={showDatePicker}
        style={styles.selectMonthButton}
      >
        <Text style={styles.selectMonthText}>
          {dayjs(selectedMonth).format("MMMM YYYY")}
        </Text>
        <AntDesign name="caretdown" size={16} color="white" />
      </TouchableOpacity>

      {Platform.OS === "ios" && showMonthPicker && (
        <Modal
          visible={showMonthPicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={tempSelectedDate}
                mode="date"
                display="spinner"
                onChange={onMonthChangeIOS}
                textColor="black"
              />
              <TouchableOpacity
                style={styles.doneButton}
                onPress={handleConfirmDateIOS}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {Platform.OS === "android" && showMonthPicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="calendar"
          onChange={onMonthChangeAndroid}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  selectMonthButton: {
    backgroundColor: "#3AAFA9",
    borderRadius: 10,
    marginBottom: 10,
    width: 150,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  selectMonthText: {
    color: "white",
    fontSize: 16,
    marginRight: 5,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  pickerContainer: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  doneButton: {
    backgroundColor: "#3AAFA9",
    height: 50,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  doneButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default MonthPicker;
