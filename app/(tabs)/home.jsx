import { View, StyleSheet, Button, Text, Alert, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useApolloClient, useQuery, gql } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../components/Home/Header";
import Progress from "../../components/Home/Progress";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const GET_TOTAL_NUTRITION = gql`
  query getTotalNutritionByDate($user_id: Int!) {
    getTotalNutritionByDate(user_id: $user_id) {
      total_calories
      total_protein
    }
  }
`;

const GET_NUTRITION = gql`
  query getRecommendedNutrition($user_id: Int!) {
    getRecommendedNutrition(user_id: $user_id) {
      recommended_calories
      recommended_protein
      recommended_water
    }
  }
`;

const GET_TOTAL_WATER = gql`
  query getTotalWaterByDate($user_id: Int!) {
    getTotalWaterByDate(user_id: $user_id) {
      total_water
    }
  }
`;

const Home = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const client = useApolloClient();
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalWater, setTotalWater] = useState(0);

  const [targetCalories, setTargetCalories] = useState(2000);
  const [targetProtein, setTargetProtein] = useState(54);
  const [remainingWater, setRemainingWater] = useState(1000); // target water value

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("user_id");
      if (id) {
        setUserId(parseInt(id));
      }
    };

    fetchUserId();
  }, []);

  // Fetch total nutrition values (calories and protein)
  const { data: totalNutritionData, refetch: refetchTotalNutrition } = useQuery(
    GET_TOTAL_NUTRITION,
    {
      variables: { user_id: userId },
      skip: !userId, // Skip if no userId is available
    }
  );

  // Fetch recommended nutrition values (target calories and protein)
  const { data: recommendedNutritionData, refetch: refetchRecommendedNutrition } = useQuery(
    GET_NUTRITION,
    {
      variables: { user_id: userId },
      skip: !userId, // Skip if no userId is available
    }
  );

  // Fetch total water consumed
  const { data: totalWaterData,  refetch: refetchTotalWater } = useQuery(GET_TOTAL_WATER, {
    variables: { user_id: userId },
    skip: !userId, // Skip if no userId is available
  });

  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        refetchTotalNutrition();
        refetchRecommendedNutrition();
        refetchTotalWater();
      }
    }, [userId])
  );

  useEffect(() => {
    if (totalNutritionData) {
      setTotalCalories(
        totalNutritionData.getTotalNutritionByDate?.total_calories || 0
      );
      setTotalProtein(
        totalNutritionData.getTotalNutritionByDate?.total_protein || 0
      );
    }
  }, [totalNutritionData]);

  useEffect(() => {
    if (recommendedNutritionData) {
      console.log("Recommended Nutrition Data:", recommendedNutritionData);
      setTargetCalories(
        recommendedNutritionData.getRecommendedNutrition[0]
          ?.recommended_calories || 2000
      );
      setTargetProtein(
        recommendedNutritionData.getRecommendedNutrition[0]
          ?.recommended_protein || 54
      );
    }
  }, [recommendedNutritionData]);

  useEffect(() => {
    console.log("totalWaterData:", totalWaterData);
    console.log("recommendedNutritionData:", recommendedNutritionData);
  
    if (totalWaterData && recommendedNutritionData) {
      const totalWaterConsumed =
        totalWaterData.getTotalWaterByDate?.total_water || 0;
      const targetWater =
        recommendedNutritionData.getRecommendedNutrition[0]?.recommended_water || 1000;
  
      console.log("Total Water Consumed:", totalWaterConsumed);
      console.log("Target Water:", targetWater);
  
      setRemainingWater(targetWater - totalWaterConsumed);
    }
  }, [totalWaterData, recommendedNutritionData]);
  

  const handleWaterPress = () => {
    router.push("Water");
  };

  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <Header />
        <Progress
          totalCalories={totalCalories}
          targetCalories={targetCalories}
          totalProtein={totalProtein}
          targetProtein={targetProtein}
        />
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.insideContainer}>
          <View style={styles.waterContainer}>
            <TouchableOpacity
              onPress={handleWaterPress}
              style={styles.waterButton}
            >
              <View style={styles.waterContent}>
                <Text style={styles.waterText}>Water</Text>
              </View>
              <View style={styles.remainingWaterContent}>
                <FontAwesome6 name="glass-water" size={24} color="white" />
                <Text style={styles.remainingWaterText}>
                  {remainingWater} ml left
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.sodiumContainer}>
            <Text>sodium</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3AAFA9",
  },
  topContainer: {
    height: 300,
    backgroundColor: "#3AAFA9",
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: "#f8f8fa",
    padding: 20,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  insideContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 10,
  },
  waterContainer: {
    height: 110,
    width: 180,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#70AFF1",
    padding: 20,
    borderRadius: 25,
  },
  waterButton: {
    flexDirection: "column",
    alignItems: "center",
  },
  waterContent: {
    alignItems: "center",
  },
  waterText: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  remainingWaterContent: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  remainingWaterText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "600",
    color: "white",
  },
  sodiumContainer: {
    height: 110,
    width: 180,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EB89CF",
    padding: 20,
    borderRadius: 25,
  },
  logoutContainer: {
    padding: 10,
    backgroundColor: "#f8f8fa",
  },
});

export default Home;
