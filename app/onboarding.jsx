import { StyleSheet, Text, View, Dimensions } from "react-native";
import React from "react";
import Onboarding from "react-native-onboarding-swiper";
import LottieView from "lottie-react-native";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";
import Animated, { SlideInRight } from "react-native-reanimated";

const { width } = Dimensions.get("window");

const OnboardingScreen = () => {
  const handleDone = () => {
    router.push("/sign-in");
  };

  const doneButton = ({ ...props }) => {
    return (
      <TouchableOpacity onPress={handleDone}>
        <Animated.View
          style={styles.doneButton}
          entering={SlideInRight}
          {...props}
        >
          <Text style={styles.doneText}>Sign In</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const nextButton = ({ ...props }) => {
    return (
      <TouchableOpacity style={styles.nextButton} {...props}>
        <Text style={styles.doneText}>Next</Text>
      </TouchableOpacity>
    );
  };

  const skipButton = ({ ...props }) => {
    return (
      <TouchableOpacity style={styles.skipButton} {...props}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Onboarding
        onDone={handleDone}
        onSkip={handleDone}
        NextButtonComponent={nextButton}
        SkipButtonComponent={skipButton}
        DoneButtonComponent={doneButton}
        bottomBarHighlight={false}
        containerStyles={{ paddingHorizontal: 15 }}
        pages={[
          {
            backgroundColor: "#f8f8fa",
            image: (
              <View>
                <LottieView
                  source={require("../assets/animations/animation2.json")}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              </View>
            ),
            title: "Empower Your Kidney Journey",
            subtitle:
              "Discover tailored dietary solutions to support your kidney health. Take control with personalized meal plans.",
          },
          {
            backgroundColor: "#f8f8fa",
            image: (
              <View>
                <LottieView
                  source={require("../assets/animations/trackfood.json")}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              </View>
            ),
            title: "Track Your Nutrients Easily",
            subtitle:
              "Effortlessly monitor sodium, potassium, and protein intake. Stay informed and protect your kidney function.",
          },
          {
            backgroundColor: "#f8f8fa",
            image: (
              <View>
                <LottieView
                  source={require("../assets/animations/checklist.json")}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              </View>
            ),
            title: "Achieve Your Health Goals",
            subtitle:
              "Set your dietary objectives and watch your progress. Simplify your CKD management with our intuitive app.",
          },
        ]}
      />
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  lottie: {
    width: width * 0.9,
    height: width * 0.9,
    justifyContent: "center",
    alignItems: "center",
  },
  doneButton: {
    padding: 20,
    width: 100,
    backgroundColor: "#3AAFA9",
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
  },
  doneText: {
    fontWeight: "600",
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
  nextButton: {
    padding: 20,
    marginRight: 15,
    width: 100,
    backgroundColor: "#3AAFA9",
    borderRadius: 100,
  },
  skipButton: {
    padding: 20,
    marginLeft: 15,
    width: 100,
    backgroundColor: "#FF6B6B",
    borderRadius: 100,
  },
  skipText: {
    fontWeight: "600",
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
});
