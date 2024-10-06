import React from "react";
import { View, Text, TextInput } from "react-native";
import { styled } from "nativewind";
import { StyleSheet } from "react-native";

const BoxWrapper = styled(View);

const Box = ({ title, content, isInput = false, onChangeText, value }) => {
  return (
    <BoxWrapper
      className="border border-gray-300 rounded-lg p-4 mb-3 bg-white flex-row items-center"
      style={styles.shadow}
    >
      <Text className="font-bold text-l mb-3 w-1/3">{title}</Text>
      {isInput ? (
        <TextInput
          className="ml-auto w-1/3 text-right bg-gray-300 rounded-lg p-2"
          value={value}
          onChangeText={onChangeText}
          keyboardType="numeric"
          placeholder="Enter serving in grams"
        />
      ) : (
        <Text className="w-2/3 text-right" numberOfLines={3} ellipsizeMode="tail">
          {content}
        </Text>
      )}
    </BoxWrapper>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
});

export default Box;
