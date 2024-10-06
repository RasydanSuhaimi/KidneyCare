import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { gql, useQuery, useMutation } from "@apollo/client";
import dayjs from "dayjs";
import { Swipeable } from "react-native-gesture-handler";
import FoodLogListItem from "../../components/FoodLogListItem";

const QUERY_FOOD_LOGS = gql`
  query foodLogsForDate($date: Date!, $user_id: String!) {
    foodLogsForDate(date: $date, user_id: $user_id) {
      user_id
      label
      food_id
      created_at
      id
      kcal
      mealtype
      serving
    }
  }
`;

const DELETE_FOOD_LOG = gql`
  mutation deleteFood_log($id: Int!) {
    deleteFood_log(id: $id) {
      id
    }
  }
`;

const Journal = () => {
  const [userId, setUserId] = useState(null);
  const formattedDate = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("user_id");
      setUserId(id);
    };

    fetchUserId();
  }, []);

  const { data, loading, error, refetch } = useQuery(QUERY_FOOD_LOGS, {
    variables: {
      date: formattedDate,
      user_id: userId,
    },
    skip: !userId,
  });

  const [deleteFoodLog] = useMutation(DELETE_FOOD_LOG, {
    onCompleted: () => {
      refetch(); // Refetch food logs after deletion
    },
    onError: (err) => {
      console.error("Error deleting food log:", err.message);
    },
  });

  if (error) {
    return (
      <SafeAreaView className="bg-gray-300 h-full">
        <Text className="text-center text-red-500">
          Failed to fetch data. Please try again.
        </Text>
      </SafeAreaView>
    );
  }

  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];

  const createDataList = (foodLogs = []) => {
    const dataList = [];
    const groupedLogs = foodLogs.reduce((acc, log) => {
      const { mealtype } = log;
      if (!acc[mealtype]) {
        acc[mealtype] = [];
      }
      acc[mealtype].push(log);
      return acc;
    }, {});

    mealTypes.forEach((mealType) => {
      dataList.push({
        type: "header",
        mealType,
        logs: groupedLogs[mealType] || [],
      });
    });

    return dataList;
  };

  const dataList = createDataList(data?.foodLogsForDate || []);

  const handleDeleteLog = (id) => {
    deleteFoodLog({ variables: { id } });
  };

  const renderRightActions = (id) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: "red",
          justifyContent: "center",
          alignItems: "center",
          width: 80, 
          height: 60, 
        }}
        onPress={() => handleDeleteLog(id)}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Delete</Text>
      </TouchableOpacity>
    );
  };

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

        <FlatList
          data={dataList}
          contentContainerStyle={{ paddingBottom: 75 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            if (item.type === "header") {
              const totalCalories = item.logs.reduce(
                (total, log) => total + log.kcal,
                0
              );

              return (
                <View className="bg-white p-3 rounded-xl mt-3">
                  <View className="flex-row justify-between items-center">
                    <Text
                      style={{ fontSize: 17, fontWeight: "600" }}
                      className="text-left p-3 mb-2"
                    >
                      {item.mealType}
                    </Text>
                    <Text
                      style={{ fontSize: 16, fontWeight: "600" }}
                      className="text-right p-3 color-secondary mb-2"
                    >
                      {totalCalories} kcal
                    </Text>
                  </View>

                  {item.logs.length > 0 ? (
                    item.logs.map((log, index) => (
                      <Swipeable
                        key={log.id}
                        renderRightActions={() => renderRightActions(log.id)}
                      >
                        <View key={log.id} className="mb-2">
                          <FoodLogListItem
                            label={log.label}
                            serving={parseFloat(log.serving)} // Ensure serving is a number
                            kcal={parseFloat(log.kcal)} // Ensure kcal is a number
                          />

                          {index !== item.logs.length - 1 && (
                            <View className="border-b border-gray-300 mt-1" />
                          )}
                        </View>
                      </Swipeable>
                    ))
                  ) : (
                    <Text className="text-center text-gray-400">
                      No food logs yet
                    </Text>
                  )}
                </View>
              );
            }
            return null;
          }}
          keyExtractor={(item, index) =>
            item.type === "header"
              ? `header-${item.mealType}`
              : item.id.toString()
          }
          ListFooterComponent={() =>
            loading ? (
              <View className="flex-1 justify-center items-center mt-4">
                <ActivityIndicator />
              </View>
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Journal;
