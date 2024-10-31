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

const DatePicker = ({ selectedDate, setSelectedDate, showMonthYearOnly, placeholder }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempSelectedDate, setTempSelectedDate] = useState(new Date());

  const onDateChangeAndroid = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      // Store the date in YYYY-MM-DD format
      setSelectedDate(dayjs(date).format("YYYY-MM-DD"));
    }
  };

  const onDateChangeIOS = (event, date) => {
    if (date) {
      setTempSelectedDate(date);
    }
  };

  const handleConfirmDateIOS = () => {
    setShowDatePicker(false);
    // Store the date in YYYY-MM-DD format
    setSelectedDate(dayjs(tempSelectedDate).format("YYYY-MM-DD"));
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={showDatePickerModal}
        style={styles.selectDateButton}
      >
        <Text
          style={[styles.selectDateText, { color: selectedDate ? "black" : "#7b7b8b" }]}
        >
          {selectedDate
            ? dayjs(selectedDate).format(showMonthYearOnly ? "MMMM YYYY" : "DD MMMM YYYY")
            : placeholder}
        </Text>
        <AntDesign name="caretdown" size={15} color="white" />
      </TouchableOpacity>

      {Platform.OS === "ios" && showDatePicker && (
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={tempSelectedDate}
                mode="date"
                display="spinner"
                onChange={onDateChangeIOS}
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

      {Platform.OS === "android" && showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="calendar"
          onChange={onDateChangeAndroid}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  selectDateButton: {
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
  selectDateText: {
    flex: 1,
    color: "black",
    fontWeight: "600",
    fontSize: 16,
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
    fontSize: 16,
  },
});

export default DatePicker;
