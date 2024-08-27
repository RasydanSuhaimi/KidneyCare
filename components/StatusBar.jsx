import { View, Text } from 'react-native';
import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import Animated from 'react-native-reanimated';

const StatusBar = () => {
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const AnimatedText = Animated.createAnimatedComponent(Text);

  const radius = 45;
  const circumference = radius * Math.PI * 2;
  const duration = 6000;

  return (
    <View className="flex-1 justify-center items-center bg-white">

      <AnimatedText className="text-black text-l font-psemibold justify-absolute"/>
      <Svg height="100" width="100" viewBox="0 0 100 100">

        <Circle
          cx="50"
          cy="50"
          r="45"
          stroke="#e7e7e7" 
          strokeWidth="10"
          fill="transparent"
        />
    
        <AnimatedCircle
        //animatedProps={}
          cx="50"
          cy="50"
          r="45"
          strokeDasharray={`${radius * Math.PI * 2}`}
          strokeWidth="10"
          fill="transparent"
        />
      </Svg>
    </View>
  );
};

export default StatusBar;
