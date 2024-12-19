import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Entypo } from "@expo/vector-icons";

// Create AnimatedCircle from the Circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const WaterProgress = ({ totalCalories, targetCalories, onNavigate }) => {
  const progress = totalCalories / targetCalories;
  const size = 75; // Define the size of the circle
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Initialize an animated value for progress
  const animatedProgress = useRef(new Animated.Value(progress)).current;

  // Animate the progress change
  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 700,
      useNativeDriver: true, // Use native driver for performance
    }).start();
  }, [progress]);

  const strokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0], // Animate the stroke offset
  });

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        {/* Custom Circle Progress */}
        <View style={styles.circleContainer}>
          <Svg height={size} width={size}>
            {/* Background Circle */}
            <Circle
              stroke="#e6e6e6"
              fill="none"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
            />
            {/* Animated Progress Circle */}
            <AnimatedCircle
              stroke={progress >= 1 ? "red" : "#3AAFA9"}
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
          {/* Progress percentage */}
          <Text style={styles.progressText}>
            {`${Math.round(progress * 100)}%`}
          </Text>
        </View>

        {/* Calorie Information */}
        <View>
          <Text style={styles.calorieText}>
            {totalCalories} of {targetCalories} Cal
          </Text>
          <Text style={styles.addCaloriesText}>
            Add more calories to your diet
          </Text>
        </View>

        {/* Navigation Button */}
        <TouchableOpacity onPress={onNavigate} style={styles.navigateButton}>
          <Entypo name="bar-graph" size={20} color="#3AAFA9" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
  },
  progressContainer: {
    height: 110,
    borderRadius: 25,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  circleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  progressText: {
    position: "absolute",
    fontSize: 17,
  },
  calorieText: {
    fontSize: 15,
    fontWeight: "600",
  },
  addCaloriesText: {
    fontSize: 13,
    paddingTop: 5,
  },
  navigateButton: {
    width: 45,
    height: 45,
    borderRadius: 30,
    backgroundColor: "#DEF2F1",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default WaterProgress;
