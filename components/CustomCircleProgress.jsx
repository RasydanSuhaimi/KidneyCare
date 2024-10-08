import React from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

const CustomCircleProgress = ({ progress, size, strokeWidth }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <View
      style={{ alignItems: "center", justifyContent: "center", marginLeft: 20 }}
    >
      <Svg height={size} width={size}>
        <Circle
          stroke="#e6e6e6"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
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
      <Text style={{ position: "absolute", fontSize: 20 }}>
        {`${Math.round(progress * 100)}%`} {/* Display Percentage */}
      </Text>
    </View>
  );
};

export default CustomCircleProgress;
