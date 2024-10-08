import React from "react";
import { FlatList, TouchableOpacity, Text, View } from "react-native";

const HorizontalDatePicker = ({
  dateList,
  selectedDate,
  setSelectedDate,
  onDateChange,
}) => {
  return (
    <View
      style={{
        height: 100,
        padding: 2,
        backgroundColor: "#8B7FF5",
        borderRadius: 25,
        marginBottom: 15,
        alignItems: "center",
      }}
    >
      <FlatList
        horizontal
        data={dateList}
        keyExtractor={(item) => item.fullDate} // Use fullDate as a unique key
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedDate(item.fullDate); // Update selected date on press
              onDateChange(); // Call the function to refetch food logs for the new date
            }}
            style={{
              padding: 20,
              backgroundColor:
                selectedDate === item.fullDate ? "#7266DC" : "#8B7FF5",
              borderRadius: 30,
              marginHorizontal: 5,
            }}
          >
            <Text
              style={{ color: "white", fontWeight: "400", textAlign: "center" }}
            >
              {item.displayDate}
            </Text>
            <Text
              style={{ color: "white", fontWeight: "700", textAlign: "center" }}
            >
              {item.day}
            </Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default HorizontalDatePicker;
