import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { useApolloClient } from "@apollo/client";

import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = () => {
  const [username, setUsername] = useState("Guest"); // Default to "Guest" if not available
  const client = useApolloClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("username");
        if (storedUsername) {
          setUsername(storedUsername);
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };
    fetchUserInfo();
  }, []);

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

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <FontAwesome name="user" size={50} color="#fff" />
      </View>

      <Text style={styles.usernameText}>{username}</Text>

      {/* Logout button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f8f8fa",
    paddingTop: 40,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#3AAFA9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  usernameText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20, // Adds spacing between username and logout button
  },
  logoutButton: {
    position: "absolute",
    bottom: 20, // Place the button at the bottom
    backgroundColor: "#3AAFA9",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
