import { Text, View, Button } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "expo-router";

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

const addFood = () => {
  const route = useRoute();
  const router = useRouter();

  const { food_id, label, kcal } = route.params;

  const [logFood] = useMutation(mutation, {
    refetchQueries: ["foodLogsForDate"],
  });

  const onPlusPressed = async () => {
    await logFood({
      variables: {
        food_id,
        kcal,
        label,
        user_id: "Alex",
      },
    });
    router.replace("/(tabs)/journal");
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Food Label: {label}</Text>
      <Text>Food ID: {food_id}</Text>
      <Text>Calories: {kcal}</Text>

      <Button title="Add Food" onPress={onPlusPressed} />
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default addFood;
