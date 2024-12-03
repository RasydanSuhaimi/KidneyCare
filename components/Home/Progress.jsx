import { Skeleton } from "moti/skeleton";
import React, { useRef, useEffect } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CalorieProgress = ({
  totalCalories,
  targetCalories,
  totalProtein,
  targetProtein,
}) => {
  const formattedRemainingProtein = (targetProtein - totalProtein).toFixed(2);

  const calorieProgress = totalCalories / targetCalories;
  const proteinProgress = totalProtein / targetProtein;
  const size = 150;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedProgress = useRef(new Animated.Value(calorieProgress)).current;
  const animatedProteinWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate calorie progress
    Animated.timing(animatedProgress, {
      toValue: calorieProgress,
      duration: 700,
      useNativeDriver: true,
    }).start();

    // Animate protein width
    Animated.timing(animatedProteinWidth, {
      toValue: proteinProgress * 100,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [calorieProgress, proteinProgress]);

  const strokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  // Calculate remaining calories
  const remainingCalories = targetCalories - totalCalories;
  //const remainingProtein = targetProtein - totalProtein;

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.circleContainer}>
          <Svg height={size} width={size}>
            <Circle
              stroke="rgba(255, 255, 255, 0.5)"
              fill="none"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
            />
            <AnimatedCircle
              stroke={calorieProgress >= 1 ? "red" : "white"}
              fill="none"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </Svg>
          {/* Centered text for remaining calories */}
          <Text style={styles.progressText}>{remainingCalories}</Text>
          <Text style={styles.kcalLeftText}>kcal left</Text>
        </View>

        <View style={styles.nutritionContainer}>
          <Text style={styles.nutritionLabel}>Protein</Text>
          <View style={styles.progressBarRow}>
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={[
                  styles.progressBarProtein,
                  {
                    width: animatedProteinWidth.interpolate({
                      inputRange: [0, 100],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>
            <Text
              style={styles.nutritionText}
            >{`${formattedRemainingProtein} g left`}</Text>
          </View>

          <Text style={styles.nutritionLabel}>Phosphorus</Text>
          <View style={styles.progressBarRow}>
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={[
                  styles.progressBarPhosphorus,
                  {
                    width: animatedProteinWidth.interpolate({
                      inputRange: [0, 100],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>
            <Text
              style={styles.nutritionText}
            >{`${formattedRemainingProtein} mg left`}</Text>
          </View>
            <Text style={styles.nutritionLabel}>Potassium</Text>
          <View style={styles.progressBarRow}>
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={[
                  styles.progressBarPotassium,
                  {
                    width: animatedProteinWidth.interpolate({
                      inputRange: [0, 100],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>
            <Text
              style={styles.nutritionText}
            >{`${formattedRemainingProtein} mg left`}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  progressContainer: {
    height: 150,
    borderRadius: 25,
    backgroundColor: "#3AAFA9",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  circleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  progressText: {
    color: "white",
    position: "absolute",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -23 }, { translateY: -20 }],
  },
  kcalLeftText: {
    color: "white",
    position: "absolute",
    fontSize: 16,
    textAlign: "center",
    top: "65%",
    left: "50%",
    transform: [{ translateX: -27 }, { translateY: -20 }],
  },

  nutritionContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    marginLeft: 20,
  },
  nutritionLabel: {
    color: "white",
    fontSize: 16,
  },
  progressBarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginRight: 40,
  },
  progressBarContainer: {
    height: 10,
    width: "70%",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarProtein: {
    height: "100%",
    backgroundColor: "#CF9FFF",
  },
  progressBarPhosphorus: {
    height: "100%",
    backgroundColor: "#F14647",
  },
  progressBarPotassium: {
    height: "100%",
    backgroundColor: "#FFBE61",
  },
  nutritionText: {
    color: "white",
    marginLeft: 5,
  },
});

export default CalorieProgress;
