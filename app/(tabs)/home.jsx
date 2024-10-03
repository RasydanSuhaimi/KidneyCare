import { View, Text, Button } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { useRouter } from "expo-router"; // Import the router to navigate

const Home = () => {
  const router = useRouter(); // Create a router instance

  // Logout function
  const handleLogout = async () => {
    try {
      // Remove user ID from AsyncStorage
      await AsyncStorage.removeItem("user_id");
      // Redirect to the sign-in page
      router.replace("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View>
        <Text>Home</Text>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </SafeAreaView>
  );
};

export default Home;
