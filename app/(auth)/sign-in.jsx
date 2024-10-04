import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  Text,
  View,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";

import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { gql, useLazyQuery } from "@apollo/client";
import { useUser } from "../../context/UserContext";

const SIGN_IN = gql`
  query SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      user_id
      username
      email
    }
  }
`;

const SignIn = () => {
  const { setUserId } = useUser(); // Access the context to set user ID
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [signInUser] = useLazyQuery(SIGN_IN);

  // Check if user is already logged in by verifying if user ID is stored in AsyncStorage
  useEffect(() => {
    const checkUserSession = async () => {
      const userId = await AsyncStorage.getItem("user_id");
      if (userId) {
        // User is logged in, redirect to the home screen
        router.replace("/(tabs)/home");
      }
    };
    checkUserSession();
  }, []);

  const submit = async () => {
    setIsSubmitting(true);
    try {
      const { data } = await signInUser({
        variables: { email: form.email, password: form.password },
      });

      if (data && data.signIn) {
        console.log("Sign-in successful:", data.signIn);

        // Store user_id in AsyncStorage
        await AsyncStorage.setItem("user_id", data.signIn.user_id);

        // Set user ID in context
        setUserId(data.signIn.user_id);

        // Navigate to home screen after successful login
        router.replace("/(tabs)/home");
      } else {
        Alert.alert("Error", "Invalid email or password");
      }
    } catch (e) {
      console.error("Sign-in failed:", e);
      Alert.alert("Error", "An error occurred while signing in");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-gray-300 h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[70vh] px-4 my-6">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          />

          <Text className="text-2xl text-black text-semibold mt-10 font-psemibold">
            Log in to KidneyCare
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign in"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          {/* Show loading indicator */}
          {isSubmitting && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-black font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg text-secondary font-psemibold"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="dark" />
    </SafeAreaView>
  );
};

const styles = {
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "gray-300", // Adjust color and opacity as needed
    zIndex: 10,
  },
};

export default SignIn;
