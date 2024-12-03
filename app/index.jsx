import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import { useQuery, gql } from "@apollo/client";

import CustomButton from "../components/CustomButton";

const { width } = Dimensions.get("window");

const GET_USER_PROFILE = gql`
  query MyQuery($user_id: Int!) {
    GetUserProfile(user_id: $user_id) {
      ispersonalinfocomplete
    }
  }
`;

export default function App() {
  const [userId, setUserId] = useState(null);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [lottieSize, setLottieSize] = useState(width * 0.9);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("user_id");
      if (id) {
        setUserId(parseInt(id));
        setLottieSize(width * 0.3);
        setShowContinueButton(false);
      } else {
        setShowContinueButton(true);
      }
    };

    fetchUserId();
  }, []);

  const { data } = useQuery(GET_USER_PROFILE, {
    variables: { user_id: userId },
    skip: !userId,
  });

  useEffect(() => {
    if (data) {
      const isPersonalInfoComplete = data.GetUserProfile.ispersonalinfocomplete;
      console.log("Retrieved user_id:", userId);
      console.log(
        "Retrieved ispersonalinfocomplete from GraphQL:",
        isPersonalInfoComplete
      );

      if (isPersonalInfoComplete === false) {
        router.replace("/personalInfo");
      } else {
        router.replace("/(tabs)/home");
      }

      setShowContinueButton(isPersonalInfoComplete === null);
    }
  }, [data]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <LottieView
          source={require("../assets/animations/kidneyGreen.json")}
          style={[styles.cards, { width: lottieSize, height: lottieSize }]}
          autoPlay
          loop ={false}
        />
        {showContinueButton && (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>
              Welcome to <Text style={styles.highlightText}>KidneyCare</Text>,
              your trusted guide to a healthier kidney-friendly diet.
            </Text>
          </View>
        )}
        {showContinueButton && (
          <CustomButton
            title="Continue"
            handlePress={() => router.push("onboarding")}
            containerStyles={styles.buttonContainer}
          />
        )}
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
    width: width * 0.7,
    height: width * 0.7,
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
