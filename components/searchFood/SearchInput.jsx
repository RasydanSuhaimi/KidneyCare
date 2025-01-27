import { View, TextInput, StyleSheet } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

const SearchInput = ({ value, onChangeText, onSubmitEditing }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search..."
        placeholderTextColor="#7b7b8b"
        returnKeyType="search"
        onSubmitEditing={onSubmitEditing}
        blurOnSubmit={false}
        accessibilityLabel="Search input"
      />
      <AntDesign name="search1" size={24} color="#7b7b8b" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    height: 60,
    paddingHorizontal: 24,
    borderColor: "#f8f8fa",
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "black",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginTop: 50,
    //marginBottom: 10,
    marginHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    color: "black",
    fontSize: 16,
    marginTop: 2,
  },
});

export default SearchInput;
