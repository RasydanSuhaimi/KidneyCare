import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { gql, useQuery, useMutation } from "@apollo/client";
import dayjs from "dayjs";
import { Swipeable } from "react-native-gesture-handler";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Dimensions } from "react-native";

import FoodLogListItem from "../../components/FoodLogListItem";
import CustomCircleProgress from "../../components/CustomCircleProgress";
import HorizontalDatePicker from "../../components/HorizontalDatePicker";

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
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  ); // State for selected date
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("user_id");
      setUserId(id);
    };

    fetchUserId();
  }, []);

  const { data, loading, error, refetch } = useQuery(QUERY_FOOD_LOGS, {
    variables: {
      date: selectedDate, // Use selectedDate for querying food logs
      user_id: userId,
    },
    skip: !userId,
    onCompleted: () => setLoadingModalVisible(false),
    onError: () => setLoadingModalVisible(false),
  });

  const [deleteFoodLog] = useMutation(DELETE_FOOD_LOG, {
    onCompleted: () => {
      refetch();
    },
    onError: (err) => {
      console.error("Error deleting food log:", err.message);
    },
  });

  useEffect(() => {
    setLoadingModalVisible(loading);
  }, [loading]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

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

  const dataList = createDataList(data?.foodLogsForDate || []); // Ensure this is defined before use

  const handleDeleteLog = (id) => {
    deleteFoodLog({ variables: { id } });
  };

  const totalCalories = dataList.reduce((total, item) => {
    if (item.type === "header") {
      return total + item.logs.reduce((sum, log) => sum + log.kcal, 0);
    }
    return total;
  }, 0);

  const targetCalories = 2000; // Set your target calorie limit here

  const deviceWidth = Dimensions.get("window").width;

  // Function to generate dates for horizontal swiping
  const generateDates = (currentDate, numDays = 30) => {
    return Array.from({ length: numDays }, (_, index) => {
      const date = dayjs(currentDate).subtract(numDays / 2 - index, "day");
      return {
        fullDate: date.format("YYYY-MM-DD"), // Keep the full date for querying
        displayDate: date.format("ddd"), // Format for abbreviated day (e.g., "Mon")
        day: date.format("DD"), // Day of the month (e.g., "1")
      };
    });
  };

  const dateList = generateDates(selectedDate, 5); // Adjust the number of visible dates

  return (
    <SafeAreaView
      className="bg-secondary flex-1"
      edges={["top", "left", "right"]}
    >
      <View className="px-4 bg-secondary">
        {/* Container for Horizontal Date Picker */}
        <HorizontalDatePicker
          dateList={dateList}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onDateChange={refetch}
        />
      </View>

      {/* Progress Circle Container */}
      <View
        className="flex-1 px-5 space-y-5 bg-gray-300"
        style={{
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        }}
      >
        <FlatList
          data={dataList}
          contentContainerStyle={{ paddingBottom: 110, marginTop: 20 }}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListHeaderComponent={
            <View className="flex items-center mb-5">
              <View
                style={{
                  width: Dimensions.get("window").width - 40,
                  height: 110,
                  borderRadius: 25,
                  backgroundColor: "white",
                  flexDirection: "row",
                  justifyContent: "left",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <CustomCircleProgress
                  progress={totalCalories / targetCalories}
                  size={80}
                  strokeWidth={7}
                />
                <View style={{ marginLeft: 15 }}>
                  <Text style={{ fontSize: 15, fontWeight: "600" }}>
                    {totalCalories} of {targetCalories} Cal
                  </Text>
                  <Text style={{ fontSize: 14, padding: "20" }}>
                    Add more calories to your diet
                  </Text>
                </View>
              </View>
            </View>
          }
          renderItem={({ item }) => {
            if (item.type === "header") {
              return (
                <View
                  className="bg-white p-3 mb-5"
                  style={{ borderRadius: 25 }}
                >
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
                      {item.logs.reduce((sum, log) => sum + log.kcal, 0)} kcal
                    </Text>
                  </View>

                  {item.logs.length > 0 ? (
                    item.logs.map((log, index) => (
                      <Swipeable
                        key={log.id} // Use log.id as unique key for Swipeable
                        renderRightActions={() => (
                          <TouchableOpacity
                            style={{
                              backgroundColor: "red",
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: 15,
                              width: 60,
                              height: 60,
                            }}
                            onPress={() => handleDeleteLog(log.id)}
                          >
                            <MaterialIcons
                              name="delete"
                              size={24}
                              color="white"
                            />
                          </TouchableOpacity>
                        )}
                      >
                        <View className="mb-2">
                          <FoodLogListItem
                            label={log.label}
                            serving={parseFloat(log.serving)}
                            kcal={parseFloat(log.kcal)}
                          />

                          {index !== item.logs.length - 1 && (
                            <View className="border-b border-gray-300 mt-1" />
                          )}
                        </View>
                      </Swipeable>
                    ))
                  ) : (
                    <Text className="text-gray-500 text-center p-3">
                      No entries for {item.mealType}.
                    </Text>
                  )}
                </View>
              );
            }
            return null;
          }}
        />
      </View>

      <Modal
        transparent={true}
        visible={loadingModalVisible}
        animationType="fade"
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#333",
            }}
          >
            <ActivityIndicator size="large" color="#fff" />
            <Text style={{ color: "#fff", marginTop: 10 }}>Loading</Text>
          </View>
        </View>
      </Modal>
      <StatusBar backgroundColor="#161622" style="dark" />
    </SafeAreaView>
  );
};

export default Journal;
