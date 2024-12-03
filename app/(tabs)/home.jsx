import { View, StyleSheet,Button, Text,Alert, TouchableOpacity } from "react-native";
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
    }
  }
`;

const Home = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const client = useApolloClient();
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [targetCalories, setTargetCalories] = useState(2000);
  const [targetProtein, setTargetProtein] = useState(54);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("user_id");
      if (id) {
        setUserId(parseInt(id));
      }
    };

    fetchUserId();
  }, []);

  // Fetch total nutrition values
  const { data: totalNutritionData, refetch: refetchTotalNutrition } = useQuery(
    GET_TOTAL_NUTRITION,
    {
      variables: { user_id: userId },
      skip: !userId,
    }
  );

  // Fetch recommended nutrition values
  const {
    data: recommendedNutritionData,
    refetch: refetchRecommendedNutrition,
  } = useQuery(GET_NUTRITION, {
    variables: { user_id: userId },
    skip: !userId,
  });

  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        refetchTotalNutrition();
        refetchRecommendedNutrition();
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

  const handleWaterPress = () => {
    router.push("./Water");
  };

  const handleLogout = async () => {
    Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          try {
            // Clear AsyncStorage
            await AsyncStorage.clear();

            // Clear Apollo Client cache
            await client.clearStore();

            Alert.alert("Success", "You have successfully logged out.", [
              {
                text: "OK",
                onPress: () => router.replace("/sign-in"),
              },
            ]);
          } catch (error) {
            console.error("Logout failed:", error);
            Alert.alert(
              "Error",
              "An error occurred while logging out. Please try again."
            );
          }
        },
      },
    ]);
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
                <Text style={styles.remainingWaterText}>2000 ml left</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.sodiumContainer}>
            <Text>sodium</Text>
          </View>
        </View>

        <View style={styles.logoutContainer}>
          <Button title="Logout" onPress={handleLogout} />
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
