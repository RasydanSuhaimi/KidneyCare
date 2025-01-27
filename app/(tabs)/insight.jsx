import React, { useEffect, useState } from "react";
import { StyleSheet, Text, Dimensions, View, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, gql } from "@apollo/client";
import { useFocusEffect } from "@react-navigation/native";

const GET_WEEKLY_NUTRIENTS = gql`
  query GetWeeklyNutrients($user_id: Int!) {
    GetWeeklyNutrients(user_id: $user_id) {
      kcal
      created_at
    }
  }
`;

const GET_MONTHLY_NUTRIENTS = gql`
  query GetMonthlyNutrients($user_id: Int!) {
    GetMonthlyNutrients(user_id: $user_id) {
      kcal
      created_at
    }
  }
`;

const GET_WEEKLY_WATER = gql`
  query GetWeeklyWater($user_id: Int!) {
    GetWeeklyWater(user_id: $user_id) {
      date_log
      water_volume
    }
  }
`;

const GET_MONTHLY_WATER = gql`
  query GetMonthlyWater($user_id: Int!) {
    GetMonthlyWater(user_id: $user_id) {
      date_log
      water_volume
    }
  }
`;

const Insight = () => {
  const [userId, setUserId] = useState(null);
  const [view, setView] = useState("week"); // To toggle between week and month

  // Fetch user ID from AsyncStorage
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("user_id");
      if (id) setUserId(parseInt(id));
    };
    fetchUserId();
  }, []);

  // Fetch nutrient data
  const {
    loading: nutrientLoading,
    error: nutrientError,
    data: nutrientData = {},
    refetch: refetchNutrients,
  } = useQuery(view === "week" ? GET_WEEKLY_NUTRIENTS : GET_MONTHLY_NUTRIENTS, {
    variables: { user_id: userId },
    skip: !userId,
    fetchPolicy: "network-only",
  });

  // Fetch water intake data
  const {
    loading: waterLoading,
    error: waterError,
    data: waterData = {},
    refetch: refetchWater,
  } = useQuery(view === "week" ? GET_WEEKLY_WATER : GET_MONTHLY_WATER, {
    variables: { user_id: userId },
    skip: !userId,
    fetchPolicy: "network-only",
  });

  // Refetch data whenever the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (refetchNutrients) refetchNutrients();
      if (refetchWater) refetchWater();
    }, [refetchNutrients, refetchWater])
  );

  if (!userId)
    return <Text style={styles.loadingText}>Loading User ID...</Text>;
  if (nutrientLoading || waterLoading)
    return <Text style={styles.loadingText}>Loading Data...</Text>;
  if (nutrientError)
    return <Text style={styles.errorText}>Error: {nutrientError.message}</Text>;
  if (waterError)
    return <Text style={styles.errorText}>Error: {waterError.message}</Text>;

  // Format water data
  const groupAndSumWaterByTime = (data = [], isMonthly) => {
    return data.reduce((acc, item) => {
      const date = new Date(item.date_log);
      const key = isMonthly
        ? `${date.getFullYear()}-${date.getMonth() + 1}` // Year-Month
        : date.toLocaleDateString(); // Day

      if (acc[key]) {
        acc[key] += item.water_volume;
      } else {
        acc[key] = item.water_volume;
      }
      return acc;
    }, {});
  };

  const waterFormattedData =
    view === "month"
      ? Array(12) // 12 months
          .fill(0)
          .map((_, index) => {
            const key = `${new Date().getFullYear()}-${index + 1}`; // Year-Month
            return {
              month: new Date(2023, index).toLocaleString("en-US", {
                month: "short",
              }),
              water_volume:
                (groupAndSumWaterByTime(
                  waterData?.[
                    view === "week" ? "GetWeeklyWater" : "GetMonthlyWater"
                  ],
                  true
                ) || {})[key] || 0,
            };
          })
      : Array(7) // 7 days for week
          .fill(0)
          .map((_, index) => {
            const day = new Date();
            day.setDate(day.getDate() - ((day.getDay() + 6) % 7) + index);
            const dayString = day.toLocaleDateString();
            return {
              day: day.toLocaleDateString("en-US", { weekday: "short" }),
              water_volume:
                (groupAndSumWaterByTime(waterData?.GetWeeklyWater, false) ||
                  {})[dayString] || 0,
            };
          });

  const waterChartData =
    view === "month"
      ? {
          labels: waterFormattedData.map((item) => item.month),
          datasets: [
            {
              data: waterFormattedData.map((item) => item.water_volume),
            },
          ],
        }
      : {
          labels: waterFormattedData.map((item) => item.day),
          datasets: [
            {
              data: waterFormattedData.map((item) => item.water_volume),
            },
          ],
        };

  // Format nutrient data
  const groupAndSumDataByTime = (data = [], isMonthly) => {
    return data.reduce((acc, item) => {
      const date = new Date(item.created_at);
      const key = isMonthly
        ? `${date.getFullYear()}-${date.getMonth() + 1}` // Year-Month
        : date.toLocaleDateString(); // Day

      if (acc[key]) {
        acc[key] += item.kcal;
      } else {
        acc[key] = item.kcal;
      }
      return acc;
    }, {});
  };

  const nutrientFormattedData =
    view === "month"
      ? Array(12) // 12 months
          .fill(0)
          .map((_, index) => {
            const key = `${new Date().getFullYear()}-${index + 1}`; // Year-Month
            return {
              month: new Date(2023, index).toLocaleString("en-US", {
                month: "short",
              }),
              kcal:
                (groupAndSumDataByTime(
                  nutrientData?.[
                    view === "week"
                      ? "GetWeeklyNutrients"
                      : "GetMonthlyNutrients"
                  ],
                  true
                ) || {})[key] || 0,
            };
          })
      : Array(7) // 7 days for week
          .fill(0)
          .map((_, index) => {
            const day = new Date();
            day.setDate(day.getDate() - ((day.getDay() + 6) % 7) + index);
            const dayString = day.toLocaleDateString();
            return {
              day: day.toLocaleDateString("en-US", { weekday: "short" }),
              kcal:
                (groupAndSumDataByTime(
                  nutrientData?.GetWeeklyNutrients,
                  false
                ) || {})[dayString] || 0,
            };
          });

  const nutrientChartData =
    view === "month"
      ? {
          labels: nutrientFormattedData.map((item) => item.month),
          datasets: [
            {
              data: nutrientFormattedData.map((item) => item.kcal),
            },
          ],
        }
      : {
          labels: nutrientFormattedData.map((item) => item.day),
          datasets: [
            {
              data: nutrientFormattedData.map((item) => item.kcal),
            },
          ],
        };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Nutritional Insights</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Week"
          onPress={() => setView("week")}
          color={view === "week" ? "#3AAFA9" : "#B2B2B2"}
        />
        <Button
          title="Month"
          onPress={() => setView("month")}
          color={view === "month" ? "#3AAFA9" : "#B2B2B2"}
        />
      </View>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Calories</Text>
        <BarChart
          data={nutrientChartData}
          width={Dimensions.get("window").width - 60}
          height={200}
          yAxisSuffix=" kcal"
          fromZero={true}
          chartConfig={{
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            fillShadowGradient: "#3AAFA9",
            fillShadowGradientOpacity: 1,
            barPercentage: view === "week" ? 0.8 : 0.3,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(33, 33, 33, ${opacity})`,
          }}
        />
      </View>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Water Intake</Text>
        <BarChart
          data={waterChartData}
          width={Dimensions.get("window").width - 60}
          height={200}
          yAxisSuffix=" ml"
          fromZero={true}
          chartConfig={{
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            fillShadowGradient: "#3AAFA9",
            fillShadowGradientOpacity: 1,
            barPercentage: view === "week" ? 0.8 : 0.3,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(33, 33, 33, ${opacity})`,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Insight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#2d3436",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  chartContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#2d3436",
    marginBottom: 10,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#b2bec3",
    textAlign: "center",
    marginTop: 50,
  },
  errorText: {
    fontSize: 16,
    color: "#d63031",
    textAlign: "center",
    marginTop: 50,
  },
});
