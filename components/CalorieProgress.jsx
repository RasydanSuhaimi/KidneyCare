import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CustomCircleProgress from './CustomCircleProgress';
import { Entypo } from '@expo/vector-icons';
import { Dimensions } from "react-native";

const deviceWidth = Dimensions.get("window").width;

const CalorieProgress = ({ totalCalories, targetCalories, onNavigate }) => (
  <View className="flex items-center mb-5">
    <View
      style={{
        width: Dimensions.get("window").width - 40,
        height: 110,
        borderRadius: 25,
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
      }}
    >
      <CustomCircleProgress
        progress={totalCalories / targetCalories}
        size={75}
        strokeWidth={7}
      />
      <View style={{ marginLeft: 20 }}>
        <Text style={{ fontSize: 15, fontWeight: "600" }}>
          {totalCalories} of {targetCalories} Cal
        </Text>
        <Text style={{ fontSize: 13, paddingTop: 5 }}>
          Add more calories to your diet
        </Text>
      </View>
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

export default CalorieProgress;
