import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Entypo } from "@expo/vector-icons";
import { Dimensions } from "react-native";

const deviceWidth = Dimensions.get("window").width;

// Create AnimatedCircle from the Circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CalorieProgress = ({ totalCalories, targetCalories, onNavigate }) => {
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
    <View className="flex items-center mb-5">
      <View
        style={{
          width: deviceWidth - 40,
          height: 110,
          borderRadius: 25,
          backgroundColor: "white",
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
        }}
      >
        {/* Custom Circle Progress */}
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 15,
          }}
        >
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
              stroke={progress >= 1 ? "red" : "#8B7FF5"}
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
          <Text style={{ position: "absolute", fontSize: 17 }}>
            {`${Math.round(progress * 100)}%`}
          </Text>
        </View>

        {/* Calorie Information */}
        <View style={{ marginLeft: 20 }}>
          <Text style={{ fontSize: 15, fontWeight: "600" }}>
            {totalCalories} of {targetCalories} Cal
          </Text>
          <Text style={{ fontSize: 13, paddingTop: 5 }}>
            Add more calories to your diet
          </Text>
        </View>

        {/* Navigation Button */}
        <TouchableOpacity
          onPress={onNavigate}
          style={{
            width: 45,
            height: 45,
            borderRadius: 30,
            backgroundColor: "#E5DFFF",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 20,
          }}
        >
          <Entypo name="bar-graph" size={20} color="#8B7FF5" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CalorieProgress;
