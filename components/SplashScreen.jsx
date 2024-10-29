import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";

const { width } = Dimensions.get("window");

const SplashScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/animations/kidneyGreen.json")}
        style={styles.lottie}
        autoPlay
        loop={false}
      />
      <Text style={styles.welcomeText}>Welcome to KidneyCare</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8fa",
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    width: width * 0.6,
    height: width * 0.6,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3AAFA9",
    marginTop: 20,
  },
});

export default SplashScreen;
