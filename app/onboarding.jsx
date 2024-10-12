import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import CustomButton from "../components/CustomButton";
import { StatusBar } from "expo-status-bar";
import Animated, {
  FadeIn,
  FadeOut,
  BounceInRight,
  BounceOutLeft,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";

const onboardingSteps = [
  {
    icon: "list-check",
    title: "Track Your Kidney Health",
    desciption:
      "Get personalized dietary advice to manage your CKD. Stay on top of your health with our tailored meal recommendations and progress tracking.",
  },
  {
    icon: "list-check",
    title: "Monitor Your Nutrient Intake",
    desciption:
      "Keep track of essential nutrients like sodium, potassium, and protein. We'll help you stay within safe limits to protect your kidneys.",
  },
  {
    icon: "list-check",
    title: "Your Health, Your Way",
    desciption:
      "Set your goals and monitor your progress. With our app, managing your diet for CKD becomes simpler and more effective.",
  },
];

const Onboarding = () => {
  const [screenIndex, setScreenIndex] = useState(0);
  const data = onboardingSteps[screenIndex];

  const onContinue = () => {
    const isLastScreen = screenIndex === onboardingSteps.length - 1;
    if (!isLastScreen) {
      setScreenIndex(screenIndex + 1);
    } else {
      endOnboarding();
    }
  };

  const endOnboarding = () => {
    router.push("/sign-in");
  };

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.stepIndicatorContainer}>
        {onboardingSteps.map((step, index) => (
          <View
            key={index}
            style={[
              styles.stepIndicator,
              { backgroundColor: index === screenIndex ? "#8B7FF5" : "grey" },
            ]}
          />
        ))}
      </View>
      <View style={styles.pageContent} key={screenIndex}>
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <FontAwesome6
            style={styles.icon}
            name={data.icon}
            size={100}
            color="#8B7FF5"
          />
        </Animated.View>
        <View style={styles.footer}>
          <Animated.Text entering={SlideInRight} style={styles.title}>
            {data.title}
          </Animated.Text>
          <Animated.Text entering={SlideInRight} style={styles.description}>
            {data.desciption}
          </Animated.Text>
          <View entering={SlideInRight} style={styles.buttonRow}>
            <Text onPress={endOnboarding} style={styles.skipText}>
              Skip
            </Text>
            <CustomButton
              title="Continue"
              handlePress={onContinue}
              containerStyles="flex-1 w-30"
            />
          </View>
        </View>
      </View>

      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  page: {
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#f8f8fa",
  },

  pageContent: {
    padding: 20,
    flex: 1,
  },

  title: {
    color: "black",
    fontSize: 50,
    fontWeight: "bold",
    marginVertical: 10,
  },

  description: {
    color: "gray",
    fontSize: 20,
    lineHeight: 28,
  },

  icon: {
    alignSelf: "center",
    margin: 20,
    marginTop: 50,
  },

  buttonRow: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
    gap: 20,
  },

  footer: {
    marginTop: "auto",
  },

  skipText: {
    padding: 15,
    fontWeight: "bold",
    fontSize: 16,
    paddingHorizontal: 25,
  },

  stepIndicator: {
    flex: 1,
    height: 3,
    backgroundColor: "grey",
    borderRadius: 10,
  },

  stepIndicatorContainer: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 15,
  },
});
