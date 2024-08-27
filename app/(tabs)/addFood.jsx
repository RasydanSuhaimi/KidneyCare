import { StatusBar } from 'expo-status-bar';
import { FlatList, SafeAreaView, View, Text  } from 'react-native';
import React, { useState } from 'react'

import FoodListItem from '../../components/FoodListItem';
import SearchInput from '../../components/SearchInput'
import CustomButton from '@/components/CustomButton';

const foodItems = [
  { label: 'Pizza', cal: '75', brand: 'Domino' },
  { label: 'Ayam', cal: '100', brand: 'Kfc' },
  { label: 'Nasi', cal: '200', brand: 'Kfry' }
];


const addFood = () => {

  const [search, setSearch] = useState('');

  const performSearch = () => {
    console.warn("Searching for:", search);
  
    setSearch('');
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex-1 justify-center my-6 px-4 space-y-10"> 

      <SearchInput 
        value={search}
        onChangeText = {setSearch}
      />

      {search &&<CustomButton
        title="Search"
        containerStyles="mt-3"
        handlePress={performSearch}
      />}
      
        <FlatList 
          data={foodItems}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem = {({item}) => <FoodListItem item = {item} />}
        />
      </View>

      <StatusBar backgroundColor='#161622'
      style='dark'/>

    </SafeAreaView>
  );
}

export default addFood;
