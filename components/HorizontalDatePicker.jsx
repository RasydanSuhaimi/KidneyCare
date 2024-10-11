import React, { useEffect, useRef } from "react";
import { FlatList, TouchableOpacity, Text, View } from "react-native";

const HorizontalDatePicker = ({
  dateList,
  selectedDate,
  setSelectedDate,
  onDateChange,
}) => {
  // Create a ref for the FlatList
  const flatListRef = useRef(null);

  // Function to scroll to the selected index
  const handleDateSelect = (item, index) => {
    setSelectedDate(item.fullDate); // Update selected date on press
    onDateChange(); // Call the function to refetch food logs for the new date

    // Scroll to the selected index
    flatListRef.current.scrollToIndex({ index, animated: true });
  };

  useEffect(() => {
    // Scroll to the selected index when the component mounts
    const selectedIndex = dateList.findIndex(item => item.fullDate === selectedDate);

    if (selectedIndex !== -1) {
      // Calculate the centered position
      const centerIndex = selectedIndex - Math.floor(2); // Adjust based on how many items you want to show on either side
      flatListRef.current.scrollToIndex({ index: centerIndex >= 0 ? centerIndex : 0, animated: true });
    }
  }, [selectedDate, dateList]); // Run when selectedDate or dateList changes

  const itemHeight = 110;
  const itemWidth = 70;

  return (
    <View
      style={{
        padding: 2,
        backgroundColor: "#8B7FF5",
        borderRadius: 25,
        marginBottom: 15,
        alignItems: "center",
      }}
    >
      <FlatList
        ref={flatListRef}
        horizontal
        data={dateList}
        keyExtractor={(item) => item.fullDate}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => handleDateSelect(item, index)}
            style={{
              width: itemWidth, 
              height: itemHeight, 
              justifyContent: "center", 
              alignItems: "center", 
              backgroundColor:
                selectedDate === item.fullDate ? "#7266DC" : "#8B7FF5",
              borderRadius: 30,
              marginHorizontal: 5,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "400",
                textAlign: "center",
                fontSize: selectedDate === item.fullDate ? 20 : 14, // Bigger font size for selected date
              }}
            >
              {item.displayDate}
            </Text>
            <Text
              style={{
                color: "white",
                fontWeight: "700",
                textAlign: "center",
              }}
            >
              {item.day}
            </Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        getItemLayout={(data, index) => ({
          length: itemWidth + 10, 
          offset: (itemWidth + 10) * index,
          index,
        })}
      />
    </View>
  );
};

export default HorizontalDatePicker;
