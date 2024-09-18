import { View, Text, LayoutAnimation } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
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

const FoodListItem = ({ item }) => {
  const [logFood, { data, loading, error }] = useMutation(mutation, {
    refetchQueries: ["foodLogsForDate"],
  });
  const router = useRouter();

  const onPlusPressed = async () => {
    await logFood({
      variables: {
        food_id: item.food.foodId,
        kcal: item.food.nutrients.ENERC_KCAL,
        label: item.food.label,
        user_id: "Alex",
      },
    });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    router.replace("/(tabs)/journal");
  };

  return (
    <View className="bg-white p-2 flex-row justify-between items-center rounded-lg border border-gray-300">
      <View className="flex-1 space-y-2">
        <Text className="font-semibold text-lg">{item.food.label}</Text>
        <Text className="text-gray-500">
          {item.food.nutrients.ENERC_KCAL} cal, {item.food.brand}
        </Text>
      </View>

      <AntDesign
        onPress={onPlusPressed}
        name="pluscircleo"
        size={24}
        color="royalblue"
      />
    </View>
  );
};

export default FoodListItem;
