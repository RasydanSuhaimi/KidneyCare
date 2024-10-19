import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { images } from "../constants";
import CustomButton from "../components/CustomButton";

export default function App() {
  useEffect(() => {
    const checkUserSession = async () => {
      const userId = await AsyncStorage.getItem("user_id");
      if (userId) {
        // User is already logged in, redirect to home
        router.replace("/(tabs)/home"); // Update to your home page route
      }
    };

    checkUserSession();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Image
          source={images.logo}
          style={styles.logo}
          resizeMode="contain"
        />
        <Image
          source={images.cards}
          style={styles.cards}
          resizeMode="contain"
        />

        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>
            Welcome to{" "}
            <Text style={styles.highlightText}>KidneyCare</Text>, your trusted guide to a healthier kidney-friendly diet.
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
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  logo: {
    width: 130,
    height: 84,
  },
  cards: {
    maxWidth: 380,
    width: '100%',
    height: 300,
  },
  welcomeContainer: {
    position: 'relative',
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4B5563', 
  },
  highlightText: {
    color: '#8B7FF5', 
  },
  buttonContainer: {
    width: '100%',
    marginTop: 28,
  },
});
