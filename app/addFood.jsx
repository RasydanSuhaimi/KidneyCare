import {
  Text,
  View,
  Button,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styled } from "nativewind";
//import { foodLogsForDate } from '../app/(tabs)/journal'; // Update the path accordingly
import MealPicker from "../components/MealPicker"; // Importing MealPicker

const Box = styled(View);

const mutation = gql`
  mutation MyMutation(
    $food_id: String!
    $kcal: Int!
    $label: String!
    $user_id: String!
    $mealtype: String!
    $serving: Int!
  ) {
    insertFood_log(
      food_id: $food_id
      kcal: $kcal
      label: $label
      user_id: $user_id
      mealtype: $mealtype
      serving: $serving
    ) {
      created_at
      food_id
      id
      kcal
      label
      user_id
      mealtype
      serving
    }
  }
`;

const AddFood = () => {
  const route = useRoute();
  const router = useRouter();
  const { food_id, label, kcal } = route.params;

  const [logFood] = useMutation(mutation, {
    refetchQueries: ["foodLogsForDate"],
  });

  const [userId, setUserId] = useState(null);
  const [mealType, setMealType] = useState("Breakfast");
  const [modalVisible, setModalVisible] = useState(false);
  const [serving, setServing] = useState("1");
  const [totalCalories, setTotalCalories] = useState(kcal);

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("user_id");
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        console.warn("No user ID found in storage");
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const servingNumber = parseInt(serving) || 1;
    setTotalCalories(kcal * servingNumber);
  }, [serving, kcal]);

  const onPlusPressed = async () => {
    if (!serving || parseInt(serving) <= 0) {
      alert("Please enter a valid serving size.");
      return;
    }

    if (userId) {
      try {
        await logFood({
          variables: {
            food_id,
            kcal: totalCalories,
            label,
            user_id: userId,
            mealtype: mealType,
            serving: parseInt(serving),
          },
        });
        setServing("1");
        setMealType("Breakfast");
        router.replace("/(tabs)/journal");
      } catch (error) {
        console.error("Error logging food:", error);
        alert("An error occurred while logging the food.");
      }
    } else {
      console.log("User ID is not available yet.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="bg-gray-300 h-full">
        <View className="p-5">
          <View>
            <Box className="border border-gray-300 rounded-lg p-4 mb-2 bg-white flex-row items-center">
              <Text className="font-bold text-l mb-3 w-1/3">
                Select Meal Type
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className="ml-auto w-1/3 text-right bg-gray-300 rounded-lg p-2"
              >
                <Text
                  className="text-right"
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {mealType}
                </Text>
              </TouchableOpacity>
            </Box>
          </View>

          {/* Use the MealPicker component */}
          <MealPicker
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            mealType={mealType}
            setMealType={setMealType}
          />

          <Box className="border border-gray-300 rounded-lg p-4 mb-2 bg-white flex-row items-center">
            <Text className="font-bold text-l mb-3 w-1/3">Food Name</Text>
            <Text
              className="w-2/3 text-right"
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {label}
            </Text>
          </Box>

          <Box className="border border-gray-300 rounded-lg p-4 mb-2 bg-white flex-row items-center">
            <Text className="font-bold text-l mb-3 w-1/3 ">Calories</Text>
            <Text
              className="w-2/3 text-right"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {totalCalories} kcal
            </Text>
          </Box>

          <Box className="border border-gray-300 rounded-lg p-4 mb-2 bg-white flex-row items-center">
            <Text className="font-bold text-l mb-3 w-1/3">Serving</Text>
            <TextInput
              className="ml-auto w-1/3 text-right bg-gray-300 rounded-lg p-2"
              value={serving}
              onChangeText={setServing}
              keyboardType="numeric"
              placeholder="Enter serving in grams"
            />
          </Box>

          <Button title="Add Food" onPress={onPlusPressed} />
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default AddFood;
