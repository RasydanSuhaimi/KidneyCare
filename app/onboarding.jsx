import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useState, useRef } from "react";
import { router } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { StatusBar } from "expo-status-bar";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native"; 


const onboardingSteps = [
  {
    icon: "list-check",
    title: "Track Your Kidney Health",
    description:
      "Get personalized dietary advice to manage your CKD. Stay on top of your health with our tailored meal recommendations and progress tracking.",
  },
  {
    icon: "list-check",
    title: "Monitor Your Nutrient Intake",
    description:
      "Keep track of essential nutrients like sodium, potassium, and protein. We'll help you stay within safe limits to protect your kidneys.",
  },
  {
    icon: "list-check",
    title: "Your Health, Your Way",
    description:
      "Set your goals and monitor your progress. With our app, managing your diet for CKD becomes simpler and more effective.",
  },
];

const Onboarding = () => {
  const [screenIndex, setScreenIndex] = useState(0);
  const data = onboardingSteps[screenIndex];
  const swipeActive = useRef(false);
  const isNavigatingToSignIn = useRef(false);

  // Function to reset onboarding to the first screen
  const resetOnboarding = () => {
    setScreenIndex(0);
    isNavigatingToSignIn.current = false;
  };

  /**const onContinue = () => {
    const isLastScreen = screenIndex === onboardingSteps.length - 1;
    if (!isLastScreen) {
      setScreenIndex(screenIndex + 1);
    } else {
      endOnboarding();
    }
  };**/

  const endOnboarding = () => {
    if (!isNavigatingToSignIn.current) {
      isNavigatingToSignIn.current = true;
      router.push("/sign-in");
    }
  };

  const onSwipeLeft = () => {
    if (!swipeActive.current) {
      if (screenIndex < onboardingSteps.length - 1) {
        swipeActive.current = true;
        setScreenIndex(screenIndex + 1);
      } else {
        endOnboarding();
      }
    }
  };

  const onSwipeRight = () => {
    if (!swipeActive.current) {
      if (screenIndex > 0) {
        swipeActive.current = true;
        setScreenIndex(screenIndex - 1);
      }
    }
  };

  const onGestureEnd = () => {
    swipeActive.current = false;
  };

  useFocusEffect(
    React.useCallback(() => {
      resetOnboarding();
    }, [])
  );

  return (
    <SafeAreaView style={styles.page}>
      <PanGestureHandler
        onGestureEvent={(event) => {
          const translationX = event.nativeEvent.translationX;

          if (translationX < -50) {
            onSwipeLeft();
          } else if (translationX > 50) {
            onSwipeRight();
          }
        }}
        onEnded={onGestureEnd}
      >
        <View style={styles.pageContent}>
          <View style={styles.skipRow}>
            <Text onPress={endOnboarding} style={styles.skipText}>
              Skip
            </Text>
          </View>

          <View key={screenIndex} style={{ flex: 1 }}>
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
                {data.description}
              </Animated.Text>

              <View style={styles.stepIndicatorContainer}>
                {onboardingSteps.map((step, index) => (
                  <View
                    key={index}
                    style={[
                      {
                        backgroundColor:
                          index === screenIndex ? "#8B7FF5" : "grey",
                        height: index === screenIndex ? 10 : 6,
                        width: index === screenIndex ? 30 : 20,
                        borderRadius: 10,
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>

          <StatusBar style="light" />
        </View>
      </PanGestureHandler>
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
    paddingTop: 0,
  },

  title: {
    color: "black",
    fontSize: 45,
    fontWeight: "600",
    marginVertical: 40,
    textAlign: "center",
  },

  description: {
    color: "gray",
    fontSize: 16,
    lineHeight: 28,
    marginVertical: 20,
    textAlign: "center",
  },

  icon: {
    alignSelf: "center",
    margin: 20,
    marginTop: 50,
  },

  button: {
    marginTop: 20,
    alignItems: "center",
  },

  skipRow: {
    alignItems: "flex-end",
  },

  footer: {
    marginTop: "auto",
  },

  skipText: {
    padding: 15,
    fontWeight: "bold",
    fontSize: 16,
    paddingHorizontal: 15,
  },

  stepIndicatorContainer: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 160,
    margin: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
