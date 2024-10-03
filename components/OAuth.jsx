import { View, Text, Image } from "react-native";
import React from "react";
import CustomButton from "./CustomButton";
import { icons } from "../constants";

const OAuth = () => {
  return (
    <View>
      <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
        <View className="flex-1 h-[1px] bg-gray-100" />
        <Text className="text-lg">Or</Text>
        <View className="flex-1 h-[1px] bg-gray-100" />
      </View>

      <CustomButton
        title="Login with Google"
        containerStyles="mt-8 w-full shadow-none"
        IconLeft={() => (
          <Image
            source={icons.google}
            resizeMode="contain"
            className="w-5 h-5 mx-2"
          />
        )}
        bgVariant="bg-transparent border"
        textVariant="text-black"
      />
    </View>
  );
};

export default OAuth;
