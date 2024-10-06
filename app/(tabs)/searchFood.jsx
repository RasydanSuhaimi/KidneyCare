import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import FoodListItem from "../../components/FoodListItem";
import SearchInput from "../../components/SearchInput";
import { gql, useLazyQuery } from "@apollo/client";

const query = gql`
  query search($ingr: String) {
    search(ingr: $ingr) {
      text
      hints {
        food {
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
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(search);
  
  const [runSearch, { data, loading, error }] = useLazyQuery(query, {
    variables: { ingr: "" },
  });

  const router = useRouter();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(search);
    }, 300); // Delay for debouncing

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      runSearch({ variables: { ingr: debouncedSearchTerm } });
    }
  }, [debouncedSearchTerm, runSearch]);

  const items = data?.search?.hints || [];

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
    <SafeAreaView className="bg-gray-300 flex-1">
      <View className="flex-1 justify-center px-3 space-y-5">
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search for a food..."
        />

        {loading && <ActivityIndicator />}

        {error && (
          <Text className="text-center text-red-500">
            Failed to search. Please try again.
          </Text>
        )}

        {items.length === 0 && !loading && !error && (
          <View className="flex-1 items-center font-pmedium">
            <Text>Search a food.</Text>
          </View>
        )}

        <FlatList
          data={items}
          contentContainerStyle={{ paddingHorizontal: 8, gap: 13, paddingBottom: 75 }}
          style={{ margin: 0 }}
          showsVerticalScrollIndicator={false}
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
