import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";

import CustomButton from "../components/CustomButton";

const { width } = Dimensions.get("window");

export default function App() {
  useEffect(() => {
    const checkUserSession = async () => {
      const userId = await AsyncStorage.getItem("user_id");
      const isPersonalInfoComplete = await AsyncStorage.getItem(
        "ispersonalinfocomplete"
      );

      if (userId) {
        if (isPersonalInfoComplete === "false") {
          router.replace("/personalInfo");
          //router.replace("/(tabs)/home");
        } else {
          //router.replace("/onboarding");
          router.replace("/(tabs)/home");
        }
      }
    };

    checkUserSession();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <LottieView
          source={require("../assets/animations/kidneyGreen.json")}
          style={styles.cards}
          autoPlay
          loop={false}
        />

        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>
            Welcome to <Text style={styles.highlightText}>KidneyCare</Text>,
            your trusted guide to a healthier kidney-friendly diet.
          </Text>
        </View>

        <CustomButton
          title="Continue"
          handlePress={() => router.push("onboarding")}
          containerStyles={styles.buttonContainer}
        />
      </View>

      <StatusBar backgroundColor="#161622" style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f8fa",
    flex: 1,
  },
  innerContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  cards: {
    width: width * 0.9,
    height: width * 0.9,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeContainer: {
    position: "relative",
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#4B5563",
  },
  highlightText: {
    color: "#3AAFA9",
  },
});
