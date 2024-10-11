import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { gql, useQuery, useMutation } from "@apollo/client";
import dayjs from "dayjs";
import { Swipeable } from "react-native-gesture-handler";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import LoadingIndicator from "../../components/LoadingIndicator";

import FoodLogListItem from "../../components/FoodLogListItem";
import CalorieProgress from "../../components/CalorieProgress";
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
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  ); // State for selected date
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("user_id");
      if (id) {
        setUserId(id);
      }
    };

    fetchUserId();
  }, []); // Empty dependency array to run only once

  const { data, loading, error, refetch } = useQuery(QUERY_FOOD_LOGS, {
    variables: {
      date: selectedDate, // Use selectedDate for querying food logs
      user_id: userId,
    },
    skip: !userId,
  });

  useEffect(() => {
    if (loading) setLoadingModalVisible(true);
    else setLoadingModalVisible(false);
  }, [loading]);

  const [deleteFoodLog] = useMutation(DELETE_FOOD_LOG, {
    onCompleted: () => refetch(),
    onError: (err) => {
      console.error("Error deleting food log:", err.message);
      Alert.alert("Error", "Failed to delete food log. Please try again.");
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

  const dataList = useMemo(
    () => createDataList(data?.foodLogsForDate || []),
    [data]
  ); // Ensure this is defined before use

  const handleDeleteLog = (id) => {
    setTimeout(() => deleteFoodLog({ variables: { id } }), 100); // Delay for smoother UX
  };

  const totalCalories = useMemo(() => {
    return dataList.reduce((total, item) => {
      if (item.type === "header") {
        return total + item.logs.reduce((sum, log) => sum + log.kcal, 0);
      }
      return total;
    }, 0);
  }, [dataList]);

  const targetCalories = 2000; // Set your target calorie limit here

  const generateDates = (currentDate) => {
    const startOfMonth = dayjs(currentDate).startOf("month");
    const endOfMonth = dayjs(currentDate).endOf("month");

    const dates = [];
    for (
      let date = startOfMonth;
      date.isBefore(endOfMonth.add(0, "day"));
      date = date.add(1, "day")
    ) {
      dates.push({
        fullDate: date.format("YYYY-MM-DD"),
        displayDate: date.format("ddd"),
        day: date.format("DD"),
      });
    }

    return dates;
  };

  const dateList = generateDates(selectedDate);

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
            <CalorieProgress
              totalCalories={totalCalories}
              targetCalories={targetCalories}
              onNavigate={() => navigation.navigate("insight")}
            />
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

      <LoadingIndicator visible={loadingModalVisible} />
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Journal;
