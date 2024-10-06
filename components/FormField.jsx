import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";

import AntDesign from "@expo/vector-icons/AntDesign"; // Import AntDesign

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  secureTextEntry,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = title === "Password" || title === "Confirm Password";

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <View
        className={`border-2 w-full h-16 px-6 border-white bg-white rounded-full focus:border-secondary items-center flex-row shadow`}
      >
        <TextInput
          className="flex-1 text-black font-psemibold text-base"
          value={value}
          placeholder={title}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={isPasswordField && !showPassword}
        />

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

export default FormField;
