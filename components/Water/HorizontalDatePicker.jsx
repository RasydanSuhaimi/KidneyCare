import React, { useEffect, useRef, useCallback } from "react";
import {
  FlatList,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from "react-native";

const HorizontalDatePicker = ({ dateList, selectedDate, setSelectedDate }) => {
  const flatListRef = useRef(null);

  // Function to scroll to the selected index
  const handleDateSelect = useCallback((item, index) => {
    setSelectedDate(item.fullDate);

    flatListRef.current.scrollToIndex({ index, animated: true });
  }, [setSelectedDate]);

  useEffect(() => {
    const selectedIndex = dateList.findIndex(
      (item) => item.fullDate === selectedDate
    );

    if (selectedIndex !== -1) {
      const centerIndex = selectedIndex - Math.floor(2); // Allow this to be configurable
      flatListRef.current.scrollToIndex({
        index: centerIndex >= 0 ? centerIndex : 0,
        animated: true,
      });
    }
  }, [selectedDate, dateList]);

  const itemHeight = 100;
  const itemWidth = 60;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        horizontal
        data={dateList}
        keyExtractor={(item) => item.fullDate}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => handleDateSelect(item, index)}
            style={[
              styles.dateItem,
              {
                backgroundColor:
                  selectedDate === item.fullDate ? "#106D66" : "#3AAFA9",
                width: itemWidth,
                height: itemHeight,
              },
            ]}
            accessibilityLabel={`Select date ${item.displayDate}, ${item.day}`}
            accessible
          >
            <Text
              style={[
                styles.dateText,
                { fontSize: selectedDate === item.fullDate ? 19 : 15 },
              ]}
            >
              {item.displayDate}
            </Text>
            <Text
              style={[
                styles.dayText,
                { fontSize: selectedDate === item.fullDate ? 19 : 15 },
              ]}
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

const styles = StyleSheet.create({
  container: {
    padding: 2,
    backgroundColor: "#3AAFA9",
    borderRadius: 25,
    marginBottom: 15,
    alignItems: "center",
  },
  dateItem: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginHorizontal: 5,
  },
  dateText: {
    color: "white",
    fontWeight: "400",
    textAlign: "center",
  },
  dayText: {
    color: "white",
    fontWeight: "700",
    textAlign: "center",
  },
});

export default HorizontalDatePicker;
