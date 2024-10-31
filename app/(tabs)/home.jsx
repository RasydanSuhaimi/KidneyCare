import { View, StyleSheet, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect

import Header from "../../components/Home/Header";
import Progress from "../../components/Home/Progress";
import Water from "../../components/Home/Water";

const Home = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [totalCalories, setTotalCalories] = useState(0);
  const [targetCalories, setTargetCalories] = useState(2000);
  const [totalProtein, setTotalProtein] = useState(0);
  const [targetProtein, setTargetProtein] = useState(54);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("user_id");
      if (id) {
        setUserId(id);
      }
    };

    fetchUserId();
  }, []);

  const fetchCalories = async () => {
    try {
      const storedTotalCalories =
        parseInt(await AsyncStorage.getItem("total_calories")) || 0;
      const storedTargetCalories =
        parseInt(await AsyncStorage.getItem("target_calories")) || 2000;
      const storedTotalProtein =
        parseInt(await AsyncStorage.getItem("total_protein")) || 0;
      const storedTargetProtein =
        parseInt(await AsyncStorage.getItem("target_protein")) || 54;

      setTotalCalories(storedTotalCalories);
      setTargetCalories(storedTargetCalories);
      setTotalProtein(storedTotalProtein);
      setTargetProtein(storedTargetProtein);
    } catch (error) {
      console.error("Failed to fetch calories:", error);
    }
  };

  // Use useFocusEffect to refetch calories when the component is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchCalories();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      router.replace("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
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
        <Water />
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
  logoutContainer: {
    padding: 10,
    backgroundColor: "#f8f8fa",
  },
});

export default Home;
