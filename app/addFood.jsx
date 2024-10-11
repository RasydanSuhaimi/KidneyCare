import React, { useEffect, useState, useMemo } from "react";
import {
  Text,
  View,
  Button,
  SafeAreaView,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MealPicker from "../components/MealPicker";
import Box from "../components/Box";

const INSERT_FOOD_LOG_MUTATION = gql`
  mutation MyMutation(
    $food_id: String!
    $kcal: Int!
    $label: String!
    $user_id: String!
    $mealtype: String!
    $serving: Int!
    $protein: Float
    $cholesterol: Float
    $fat: Float
    $fiber: Float
  ) {
    insertFood_log(
      food_id: $food_id
      kcal: $kcal
      label: $label
      user_id: $user_id
      mealtype: $mealtype
      serving: $serving
      protein: $protein
      cholesterol: $cholesterol
      fat: $fat
      fiber: $fiber
    ) {
      created_at
      food_id
      id
      kcal
      label
      user_id
      mealtype
      serving
      protein
      cholesterol
      fat
      fiber
    }
  }
`;

const AddFood = () => {
  const route = useRoute();
  const router = useRouter();
  const { food_id, label, kcal, protein, cholesterol, fat, fiber } = route.params;

  const [logFood, { loading }] = useMutation(INSERT_FOOD_LOG_MUTATION, {
    refetchQueries: ["foodLogsForDate"],
  });

  const [userId, setUserId] = useState(null);
  const [mealType, setMealType] = useState("Breakfast");
  const [modalVisible, setModalVisible] = useState(false);
  const [serving, setServing] = useState("1");

  // Memoized totalCalories calculation
  const totalCalories = useMemo(() => {
    const servingNumber = parseInt(serving, 10) || 1;
    return kcal * servingNumber;
  }, [serving, kcal]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("user_id");
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          console.warn("No user ID found in storage");
        }
      } catch (error) {
        console.error("Failed to retrieve user ID:", error);
      }
    };
    fetchUserId();
  }, []);

  const handleLogFood = async () => {
    if (!serving || parseInt(serving) <= 0) {
      return Alert.alert("Invalid Input", "Please enter a valid serving size.");
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
            serving: parseInt(serving, 10),
            protein,
            cholesterol,
            fat,
            fiber,
          },
        });
        resetForm();
        router.replace("/(tabs)/journal");
      } catch (error) {
        console.error("Error logging food:", error);
        Alert.alert("Error", "An error occurred while logging the food.");
      }
    } else {
      console.log("User ID is not available yet.");
    }
  };

  const resetForm = () => {
    setServing("1");
    setMealType("Breakfast");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="bg-gray-300 flex-1 ">
        <View className="p-5">
          <Box
            title="Meal"
            content={
              <View className="flex-row items-center justify-between">
                <Text className="w-1/3"></Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  className="bg-gray-300 rounded-lg p-2 w-2/3"
                >
                  <Text
                    className="text-right"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {mealType}
                  </Text>
                </TouchableOpacity>
              </View>
            }
          />

          <MealPicker
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            mealType={mealType}
            setMealType={setMealType}
          />

          <Box title="Food Name" content={label} />
          <Box title="Calories" content={`${totalCalories} kcal`} />
          <Box
            title="Serving"
            isInput
            onChangeText={setServing}
            value={serving}
            keyboardType="numeric" // Ensures only numbers can be entered
          />

          <Button title="Add Food" onPress={handleLogFood} disabled={loading} />
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default AddFood;
