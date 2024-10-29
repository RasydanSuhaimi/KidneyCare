import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const YesNoPicker = ({ selectedOption, setSelectedOption }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.option,
          selectedOption === "Yes" && styles.selectedOption,
        ]}
        onPress={() => setSelectedOption("Yes")}
      >
        <Text style={styles.text}>Yes</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.option,
          selectedOption === "No" && styles.selectedOption,
        ]}
        onPress={() => setSelectedOption("No")}
      >
        <Text style={styles.text}>No</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    
  },
  option: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    marginHorizontal: 5,
    borderRadius: 20,
    marginBottom: 8
  },
  selectedOption: {
    backgroundColor: "#3AAFA9",
  },
  text: {
    color: "#000",
    fontSize: 16,
  },
});

export default YesNoPicker;
