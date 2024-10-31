import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const Header = () => {
  const [username, setUsername] = useState("Guest"); // Default to "Guest" if not available

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

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.usernameText}>Hello, {username}</Text>
      </View>
      <View style={styles.iconCircle}>
      <FontAwesome name="user" size={25} color="#3AAFA9" />
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  usernameText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
  },

  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e0e0e0", 
    alignItems: "center",
    justifyContent: "center",
  },
});
