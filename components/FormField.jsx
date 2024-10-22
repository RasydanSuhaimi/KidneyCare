import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

const FormField = ({
  title,
  value,
  handleChangeText,
  otherStyles,
  secureTextEntry,
  placeholder,
  keyboardType = "default", 
  unit = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = title === "Password" || title === "Confirm Password";

  return (
    <View style={[styles.container, otherStyles]}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={isPasswordField && !showPassword}
          keyboardType={keyboardType} 
          {...props}
        />
        {/* Display unit (like kg or cm) next to the input field */}
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}

        {isPasswordField && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <AntDesign
              name={showPassword ? "eye" : "eyeo"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  inputContainer: {
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
  input: {
    flex: 1,
    color: "black",
    fontWeight: "600",
    fontSize: 16,
  },
  unit: {
    marginLeft: 10,
    color: "#7b7b8b",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default FormField;
