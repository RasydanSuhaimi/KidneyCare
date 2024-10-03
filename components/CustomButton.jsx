import { TouchableOpacity, Text } from "react-native";
import React from "react";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  bgVariant = "primary",
  textVariant = "default",
  IconLeft,
  className,
  ...props
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`w-full bg-secondary rounded-full min-h-[62px] flex flex-row justify-center items-center shadow-md shadow-neutral-400/70  ${bgVariant} ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
    >
      {IconLeft && <IconLeft />}
      <Text className={`text-white font-psemibold text-lg ${textStyles} ${textVariant}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
