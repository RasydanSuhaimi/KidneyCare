import { Text, View, Button } from "react-native";
import React, { useEffect, useState } from "react"; // Import useEffect and useState
import { useRoute } from "@react-navigation/native";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const mutation = gql`
  mutation MyMutation(
    $food_id: String!
    $kcal: Int!
    $label: String!
    $user_id: String!
  ) {
    insertFood_log(
      food_id: $food_id
      kcal: $kcal
      label: $label
      user_id: $user_id
    ) {
      created_at
      food_id
      id
      kcal
      label
      user_id
    }
  }
`;

const AddFood = () => {
  // Capitalized the component name
  const route = useRoute();
  const router = useRouter();
  const { food_id, label, kcal } = route.params;

  const [logFood] = useMutation(mutation, {
    refetchQueries: ["foodLogsForDate"],
  });

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("user_id");
      setUserId(id);
      console.log("Fetched User ID:", id);
    };

    fetchUserId();
  }, []);

  const onPlusPressed = async () => {
    if (userId) {
      await logFood({
        variables: {
          food_id,
          kcal,
          label,
          user_id: userId, // Use the dynamically fetched userId
        },
      });
      router.replace("/(tabs)/journal");
    } else {
      console.log("User ID is not available yet.");
    }
  };

  // Fetch the user ID from AsyncStorage when the component mounts
  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("user_id");
      setUserId(storedUserId); // Set user ID from AsyncStorage
    };
    fetchUserId();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>Food Label: {label}</Text>
      <Text>Food ID: {food_id}</Text>
      <Text>Calories: {kcal}</Text>

      <Button title="Add Food" onPress={onPlusPressed} />
      <Button title="Go Back" onPress={() => router.back()} />
    </View>
  );
};

export default AddFood;
