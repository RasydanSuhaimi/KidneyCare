import { StyleSheet, Button, Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import React from "react";

const handleLogout = async () => {
  Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
    {
      text: "Cancel",
      style: "cancel",
    },
    {
      text: "Logout",
      onPress: async () => {
        try {
          // Clear AsyncStorage
          await AsyncStorage.clear();

          // Clear Apollo Client cache
          await client.clearStore();

          Alert.alert("Success", "You have successfully logged out.", [
            {
              text: "OK",
              onPress: () => router.replace("/sign-in"),
            },
          ]);
        } catch (error) {
          console.error("Logout failed:", error);
          Alert.alert(
            "Error",
            "An error occurred while logging out. Please try again."
          );
        }
      },
    },
  ]);
};

const Insight = () => {
  return (
    <SafeAreaView className="bg-gray-300 h-full">
      <View style={styles.logoutContainer}>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </SafeAreaView>
  );
};

export default Insight;

const styles = StyleSheet.create({
  logoutContainer: {
    padding: 10,
    backgroundColor: "#f8f8fa",
  },
});
