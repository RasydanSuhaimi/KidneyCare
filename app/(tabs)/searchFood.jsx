import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import FoodListItem from "../../components/FoodListItem";
import SearchInput from "../../components/SearchInput";
import { gql, useLazyQuery } from "@apollo/client";
import LoadingIndicator from "../../components/LoadingIndicator"; // Import your LoadingIndicator component

const query = gql`
  query search($ingr: String) {
    search(ingr: $ingr) {
      text
      hints {
        food {
          foodId
          label
          nutrients {
            CHOCDF
            ENERC_KCAL
            FAT
            FIBTG
            PROCNT
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
    router.push({
      pathname: "/addFood",
      params: {
        food_id: item.food.foodId,
        label: item.food.label,
        kcal: item.food.nutrients.ENERC_KCAL,
        cholesterol: item.food.nutrients.CHOCDF,
        fat: item.food.nutrients.FAT,
        fiber: item.food.nutrients.FIBTG,
        protein: item.food.nutrients.PROCNT,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search for a food..."
        />

        <LoadingIndicator visible={loading} />

        {error && (
          <Text style={styles.errorText}>
            Failed to search. Please try again.
          </Text>
        )}

        {items.length === 0 && !loading && !error && (
          <View style={styles.emptyState}>
            <Text>Search a food.</Text>
          </View>
        )}

        <FlatList
          data={items}
          contentContainerStyle={styles.flatListContent}
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

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: "#f8f8fa",
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  errorText: {
    textAlign: "center",
    color: "#FF0000",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
  },
  flatListContent: {
    padding: 8,
    paddingBottom: 75,
    gap: 13,
  },
});

export default SearchScreen;
