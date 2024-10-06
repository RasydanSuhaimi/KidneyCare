import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { ScrollView, Text, View, Image } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

import { images } from "../constants";
import CustomButton from "../components/CustomButton";

export default function App() {
  useEffect(() => {
    const checkUserSession = async () => {
      const userId = await AsyncStorage.getItem("user_id");
      if (userId) {
        // User is already logged in, redirect to home
        router.replace("/(tabs)/home"); // Update to your home page route
      }
    };

    checkUserSession();
  }, []);

  return (
    <SafeAreaView className="bg-gray-300 flex-1">
      <View className="w-full justify-center items-center flex-grow px-4">
        <Image
          source={images.logo}
          className="w-[130px] h-[84px]"
          resizeMode="contain"
        />
        <Image
          source={images.cards}
          className="max-w-[380px] w-full h-[300px]"
          resizeMode="contain"
        />

        <View className="relative mt-5">
          <Text className="text-2xl font-bold text-center text-gray-800">
            Welcome to{" "}
            <Text className="text-2xl font-bold text-center text-secondary">
              KidneyCare
            </Text>
            , your trusted guide to a healthier kidney-friendly diet.
          </Text>
        </View>

        <CustomButton
          title="Continue with Email"
          handlePress={() => router.push("/sign-in")}
          containerStyles="w-full mt-7"
        />
      </View>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}
