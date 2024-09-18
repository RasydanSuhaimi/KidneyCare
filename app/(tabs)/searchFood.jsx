import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";

import FoodListItem from "../../components/FoodListItem";
import SearchInput from "../../components/SearchInput";
import CustomButton from "@/components/CustomButton";
import { gql, useLazyQuery } from "@apollo/client";

const query = gql`
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

const SearchScreen = () => {
  const [search, setSearch] = useState("");

  const [runSearch, { data, loading, error }] = useLazyQuery(query, {
    variables: { ingr: "" },
  });

  const performSearch = () => {
    runSearch({ variables: { ingr: search } });
  };

  if (error) {
    console.log("error", error);
    return <Text className="text-center justify-center">Failed to search</Text>;
  }

  const items = data?.search?.hints || [];

  const router = useRouter();

  const handleItemPress = (item) => {
    console.log(
      "Pressed item:",
      item.food.label,
      item.food.nutrients.ENERC_KCAL,
      item.food.foodId
    );
    router.push({
      pathname: "/addFood",
      params: {
        food_id: item.food.foodId,
        label: item.food.label,
        kcal: item.food.nutrients.ENERC_KCAL,
      },
    });
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="flex-1 justify-center px-3 space-y-7">
        <SearchInput value={search} onChangeText={setSearch} />

        {search && (
          <CustomButton
            title="Search"
            containerStyles="mt-3"
            handlePress={performSearch}
          />
        )}

        {loading && <ActivityIndicator />}
        <FlatList
          data={items}
          contentContainerStyle={{ gap: 7 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center font-pmedium">
              <Text>Search a food</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleItemPress(item)}>
              <FoodListItem item={item} />
            </TouchableOpacity>
          )}
        />
      </View>

      <StatusBar backgroundColor="#161622" style="dark" />
    </SafeAreaView>
  );
};

export default SearchScreen;
