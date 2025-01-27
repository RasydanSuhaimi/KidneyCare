import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from '@react-navigation/native';  // Import useNavigation

const Header = () => {
  const [username, setUsername] = useState("Guest"); // Default to "Guest" if not available
  const navigation = useNavigation(); // Get navigation object

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

  const handleProfilePress = () => {
    // Navigate to the profile page
    navigation.navigate("profile");  // "Profile" should match the name of the profile screen in your navigator
  };

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.usernameText}>Hello, {username}</Text>
      </View>
      <TouchableOpacity style={styles.iconCircle} onPress={handleProfilePress}>
        <FontAwesome name="user" size={25} color="#3AAFA9" />
      </TouchableOpacity>
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
