import { View, Text, FlatList, Button, ActivityIndicator } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

import FoodLogListItem from "../../components/FoodLogListItem";
import { gql, useQuery } from "@apollo/client";
import dayjs from "dayjs";

const query = gql`
  query foodLogsForDate($date: Date!, $user_id: String!) {
    foodLogsForDate(date: $date, user_id: $user_id) {
      user_id
      label
      food_id
      created_at
      id
      kcal
    }
  }
`;

const journal = () => {
  const user_id = "Alex";
  const formattedDate = dayjs().format("YYYY-MM-DD"); // Ensure it matches the time zone in your database

  const { data, loading, error } = useQuery(query, {
    variables: {
      date: formattedDate,
      user_id,
    },
  });

  return (
    <SafeAreaView className="bg-gray-300 h-full">
      <View className="flex-1 flex-1 px-3 space-y-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-100 font-pmedium flex-1">Calories</Text>
          <Text> 1770 - 360 = 1692</Text>
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-100 font-pmedium flex-1">
            Today's logged food
          </Text>
          <Link href="../../searchFood" asChild>
            <Button title="Add Food" />
          </Link>
        </View>
        
        {/* Loading, error, or no data section */}
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator />
          </View>
        ) : error ? (
          <Text>Failed to fetch data</Text>
        ) : data?.foodLogsForDate.length === 0 ? (
          <Text>No food logs found for this date</Text>
        ) : (
          // Render the FlatList only when data is available
          <FlatList
            data={data.foodLogsForDate}
            contentContainerStyle={{ paddingHorizontal: 8, gap: 13 }}  // Space between left and right
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <FoodLogListItem item={item} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default journal;
