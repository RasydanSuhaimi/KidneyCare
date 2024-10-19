import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Modal,
} from "react-native";
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
import MonthPicker from "../../components/MonthPicker";

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
  );
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("YYYY-MM"));
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("user_id");
      if (id) {
        setUserId(id);
      }
    };

    fetchUserId();
  }, []);

  const { data, loading, error, refetch } = useQuery(QUERY_FOOD_LOGS, {
    variables: {
      date: selectedDate,
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

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>
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
  );

  const handleDeleteLog = (id) => {
    setTimeout(() => deleteFoodLog({ variables: { id } }), 100);
  };

  const totalCalories = useMemo(() => {
    return dataList.reduce((total, item) => {
      if (item.type === "header") {
        return total + item.logs.reduce((sum, log) => sum + log.kcal, 0);
      }
      return total;
    }, 0);
  }, [dataList]);

  const targetCalories = 2000;

  const generateDatesForMonth = (month) => {
    const startOfMonth = dayjs(month).startOf("month");
    const endOfMonth = dayjs(month).endOf("month");

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

  const dateList = generateDatesForMonth(selectedMonth);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.datePickerContainer}>
        <MonthPicker
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          setSelectedDate={setSelectedDate}
          styles={styles}
        />
        <HorizontalDatePicker
          dateList={dateList}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onDateChange={refetch}
        />
      </View>

      <View style={styles.progressContainer}>
        <FlatList
          data={dataList}
          contentContainerStyle={styles.flatListContent}
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
                <View style={styles.headerContainer}>
                  <View style={styles.headerContent}>
                    <Text style={styles.mealTypeText}>{item.mealType}</Text>
                    <Text style={styles.kcalText}>
                      {item.logs.reduce((sum, log) => sum + log.kcal, 0)} kcal
                    </Text>
                  </View>

                  {item.logs.length > 0 ? (
                    item.logs.map((log, index) => (
                      <Swipeable
                        key={log.id}
                        renderRightActions={() => (
                          <TouchableOpacity
                            style={styles.deleteButton}
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
                        <View style={styles.logItem}>
                          <FoodLogListItem
                            label={log.label}
                            serving={parseFloat(log.serving)}
                            kcal={parseFloat(log.kcal)}
                          />

                          {index !== item.logs.length - 1 && (
                            <View style={styles.separator} />
                          )}
                        </View>
                      </Swipeable>
                    ))
                  ) : (
                    <Text style={styles.noEntriesText}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8B7FF5",
  },
  datePickerContainer: {
    paddingHorizontal: 16,
    backgroundColor: "#8B7FF5",
  },
  progressContainer: {
    flex: 1,
    backgroundColor: "#f8f8fa",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  flatListContent: {
    paddingBottom: 55,
    padding: 20,
    shadowColor: "black",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  headerContainer: {
    backgroundColor: "white",
    padding: 12,
    marginBottom: 20,
    borderRadius: 25,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mealTypeText: {
    fontSize: 17,
    fontWeight: "600",
    textAlign: "left",
    paddingHorizontal: 12,
    padding: 20,
  },
  kcalText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "right",
    paddingHorizontal: 12,
    color: "#8B7FF5",
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    width: 60,
    height: 60,
  },
  logItem: {
    marginBottom: 8,
  },
  separator: {
    borderBottomColor: "#D1D5DB",
    borderBottomWidth: 1,
    marginVertical: 6,
  },
  noEntriesText: {
    textAlign: "center",
    color: "#6B7280",
    padding: 5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFEDD5",
  },
  errorText: {
    color: "#FF0000",
  },
});

export default Journal;
