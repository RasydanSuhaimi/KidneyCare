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

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    );
  }
  if (error) {
    return <Text>Failed to fetch data</Text>;
  }
  if (data?.foodLogsForDate.length === 0) {
    return <Text>No food logs found for this date</Text>;
  }

  console.log(data);

  return (
    <SafeAreaView className="bg-white h-full">
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

        <FlatList
          data={data.foodLogsForDate}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 7 }}
          renderItem={({ item }) => <FoodLogListItem item={item} />}
        />
      </View>
    </SafeAreaView>
  );
};

export default journal;
