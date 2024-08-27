import { View, Text } from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';

const FoodListItem = ({ item, onPlusPressed }) => {
  return (
    <View className="bg-white p-4 flex-row justify-between items-center rounded-lg">
 
      <View className="flex-1 space-y-3">
        <Text className="font-semibold text-lg">{item.label}</Text>
        <Text className="text-gray-500">{item.cal}, {item.brand}</Text>
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
