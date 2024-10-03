import { View, Text } from "react-native";
import React from "react";

const FoodLogListItem = ({ item }) => {
  return (
    <View
      className="bg-white p-5 flex-row justify-between items-center rounded-lg shadow"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
      }}
    >
      <View className="flex-1 space-y-2">
        <Text style={{ fontSize: 15, fontWeight: "bold" }}>{item.label}</Text>
        <Text className="text-gray-500">{item.kcal} cal</Text>
      </View>
    </View>
  );
};

export default FoodLogListItem;
