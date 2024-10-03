import { View, Text, LayoutAnimation } from "react-native";
import React from "react";

const FoodListItem = ({ item }) => {
  return (
    <View className="bg-white p-3 flex-row justify-between items-center rounded-lg shadow"  style={{
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 0 },  
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    }}>
      <View className="flex-1 space-y-4">
        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
          {item.food.label}
        </Text>
        <Text className="text-gray-500">
          {item.food.nutrients.ENERC_KCAL} cal
        </Text>
      </View>
    </View>
  );
};

export default FoodListItem;
