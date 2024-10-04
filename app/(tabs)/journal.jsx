import { View, Text, FlatList, Button, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

const Journal = () => {
  const [userId, setUserId] = useState(null);
  const formattedDate = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("user_id");
      console.log("Fetched User ID:", id, "Type:", typeof id);
      setUserId(id);
    };

    fetchUserId();
  }, []);

  const { data, loading, error } = useQuery(query, {
    variables: {
      date: formattedDate,
      user_id: userId,
    },
    skip: !userId,
  });

  /**console.log("Query Variables:", {
    date: formattedDate,
    user_id: userId,
  });**/

  // Log the query response
  useEffect(() => {
    if (data) {
      console.log("Query response:", data);
    }
  }, [data]);

  return (
    <SafeAreaView className="bg-gray-300 h-full">
      <View className="flex-1 px-3 space-y-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-100 font-pmedium flex-1">Calories</Text>
          <Text> 1770 - 360 = 1692</Text>
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-100 font-pmedium flex-1">
            Today's logged food
          </Text>
        </View>

        {/* Loading, error, or no data section */}
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator />
          </View>
        ) : error ? (
          <Text>Failed to fetch data</Text>
        ) : data && data.foodLogsForDate ? ( // Check if data and foodLogsForDate exist
          data.foodLogsForDate.length === 0 ? (
            <Text>No food logs found for this date</Text>
          ) : (
            <FlatList
              data={data.foodLogsForDate}
              contentContainerStyle={{ paddingHorizontal: 8, gap: 13 }} // Space between left and right
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => <FoodLogListItem item={item} />}
            />
          )
        ) : (
          <Text>No data available</Text> // Fallback message if data is not available
        )}
      </View>
    </SafeAreaView>
  );
};

export default Journal;
