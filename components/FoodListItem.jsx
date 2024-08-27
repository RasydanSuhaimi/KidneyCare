import { View, Text } from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';

const FoodListItem = ({ item, onPlusPressed }) => {
  return (
    <View className="bg-white p-3 flex-row justify-between items-center rounded-lg">
 
      <View className="flex-1 space-y-2">
        <Text className="font-semibold text-lg">{item.food.label}</Text>
        <Text className="text-gray-500">{item.food.nutrients.ENERC_KCAL} cal, {item.food.brand}</Text>
      </View>
      
      <AntDesign 
        onPress={onPlusPressed} 
        name="pluscircleo" 
        size={24} 
        color="royalblue" 
      />
    </View>
  );
}

export default FoodListItem;
