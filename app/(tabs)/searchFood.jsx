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
import FoodListItem from "../../components/searchFood/FoodListItem";
import SearchInput from "../../components/searchFood/SearchInput";
import { gql, useLazyQuery } from "@apollo/client";
import LoadingIndicator from "../../components/LoadingIndicator";
import { Picker } from "@react-native-picker/picker";

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

  const [selectedNutrient, setSelectedNutrient] = useState("ENERC_KCAL"); // Default to calories
  const [sortOrder, setSortOrder] = useState("highest"); // Default to highest
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

  // Sort items based on the selected nutrient and sort order
  const sortedItems = [...items].sort((a, b) => {
    const nutrientA = a.food.nutrients[selectedNutrient];
    const nutrientB = b.food.nutrients[selectedNutrient];

    if (sortOrder === "highest") {
      return nutrientB - nutrientA; // Sort descending
    } else {
      return nutrientA - nutrientB; // Sort ascending
    }
  });

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

        {/* Show Picker for Nutrient Selection */}
        {debouncedSearchTerm.length > 0 && (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedNutrient}
              onValueChange={(itemValue) => setSelectedNutrient(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Calories" value="ENERC_KCAL" />
              <Picker.Item label="Protein" value="PROCNT" />
              <Picker.Item label="Carbs" value="CHOCDF" />
              <Picker.Item label="Fat" value="FAT" />
            </Picker>

            {/* Picker for Sorting Order */}
            <Picker
              selectedValue={sortOrder}
              onValueChange={(itemValue) => setSortOrder(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Highest First" value="highest" />
              <Picker.Item label="Lowest First" value="lowest" />
            </Picker>
          </View>
        )}

        <LoadingIndicator visible={loading} />

        {error && (
          <Text style={styles.errorText}>
            Failed to search. Please try again.
          </Text>
        )}

        {sortedItems.length === 0 && !loading && !error && (
          <View style={styles.emptyState}>
            <Text>Search a food.</Text>
          </View>
        )}

        <FlatList
          data={sortedItems}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleItemPress(item)}>
              <FoodListItem item={item} selectedNutrient={selectedNutrient} />
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
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  picker: {
    backgroundColor: "#fff",
    margin: 5,
    borderRadius: 8,
    flex: 1,
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
