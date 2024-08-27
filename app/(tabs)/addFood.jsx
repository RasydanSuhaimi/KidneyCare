import { StatusBar } from 'expo-status-bar';
import { FlatList, SafeAreaView, View, Text, ActivityIndicator  } from 'react-native';
import React, { useState } from 'react'

import FoodListItem from '../../components/FoodListItem';
import SearchInput from '../../components/SearchInput'
import CustomButton from '@/components/CustomButton';
import { gql, useLazyQuery } from '@apollo/client'

const query = gql `
  query search($ingr: String) {
    search(ingr: $ingr) {
      text
      hints {
        food {
          brand
          foodId
          label
          nutrients {
            ENERC_KCAL
          }
        }
      }
    }
  }
`;

const foodItems = [
  { label: 'Pizza', cal: '75', brand: 'Domino' },
  { label: 'Ayam', cal: '100', brand: 'Kfc' },
  { label: 'Nasi', cal: '200', brand: 'Kfry' }
];


const SearchScreen = () => {

  const [search, setSearch] = useState('');

  const [runSearch, { data, loading, error }] = useLazyQuery(query, {variables: {ingr:"Pizza"}});

  const performSearch = () => {
    runSearch({variables: {ingr:search}});
  };

  /*if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <ActivityIndicator size="large" />
      </View>
    );
  }*/

  if (error) {
    console.log("error", error)
    return <Text className = "text-center justify-center">Failed to search</Text>
  }

  const items = data?.search?.hints || [];

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex-1 justify-center px-3 space-y-10"> 

      <SearchInput 
        value={search}
        onChangeText = {setSearch}
      />

      {search &&<CustomButton
        title="Search"
        containerStyles="mt-3"
        handlePress={performSearch}
      />}
      
      {loading && 
      <View className="flex-1 justify-center items-center bg-primary">
        <ActivityIndicator size="large" />
      </View>}

        <FlatList 
          data={items}
          ItemSeparatorComponent={() => <View className="h-3" />}
          ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center font-pmedium">
            <Text>Search a food</Text>
          </View>)}
          renderItem = {({item}) => <FoodListItem item = {item} />}
        />
      </View>

      <StatusBar backgroundColor='#161622'
      style='dark'/>

    </SafeAreaView>
  );
}

export default SearchScreen;
