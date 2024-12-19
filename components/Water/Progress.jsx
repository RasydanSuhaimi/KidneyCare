import React, { useRef, useEffect } from "react";
import { View, Text, Animated, StyleSheet, Alert } from "react-native";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const WaterProgress = ({
  totalWater,
  targetWater,
}) => {

  const WaterProgress = totalWater / targetWater;
  const size = 150;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedProgress = useRef(new Animated.Value(WaterProgress)).current;

  useEffect(() => {
    // Animate Water progress
    Animated.timing(animatedProgress, {
      toValue: WaterProgress,
      duration: 700,
      useNativeDriver: true,
    }).start();

    // Check if the total water exceeds the target water
    if (totalWater > targetWater) {
      Alert.alert(
        "Water Intake Exceeded",
        `You have exceeded your target water intake by ${totalWater - targetWater} ml.`,
        [{ text: "OK" }]
      );
    }

  }, [WaterProgress, totalWater, targetWater]);

  const strokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  // Calculate remaining water
  const remainingWater = targetWater - totalWater;

  return (
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
              stroke={WaterProgress >= 1 ? "red" : "white"}
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
          {/* Centered text for remaining water */}
          <Text style={styles.progressText}>{remainingWater}</Text>
          <Text style={styles.waterLeftText}>ml left</Text>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    height: 180,
    borderRadius: 25,
    backgroundColor: "#3AAFA9",
    flexDirection: "row",
    justifyContent: "center",
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
    top: "40%",
    left: "50%",
    transform: [{ translateX: -16 }, { translateY: -20 }],
  },
  waterLeftText: {
    color: "white",
    position: "absolute",
    fontSize: 16,
    textAlign: "center",
    top: "55%",
    left: "50%",
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
});

export default WaterProgress;
