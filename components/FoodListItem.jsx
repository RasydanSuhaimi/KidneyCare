import { View, Text, LayoutAnimation } from "react-native";
import React from "react";

const FoodListItem = ({ item }) => {
  return (
    <View className="bg-white p-2 flex-row justify-between items-center rounded-lg border border-gray-300">
      <View className="flex-1 space-y-2">
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          {item.food.label}
        </Text>
        <Text className="text-gray-500">
          {item.food.nutrients.ENERC_KCAL} cal, {item.food.brand}
        </Text>
      </View>
    </View>
  );
};

export default FoodListItem;
