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

  // Check if user is already logged in
  useEffect(() => {
    const checkUserSession = async () => {
      const userId = await AsyncStorage.getItem("user_id");
      if (userId) {
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

      if (data?.signIn) {
        await AsyncStorage.setItem("user_id", data.signIn.user_id);
        setUserId(data.signIn.user_id);
        router.replace("/(tabs)/home");
      } else {
        Alert.alert("Invalid email or password", "Please try again.");
      }
    } catch (error) {
      console.error("Sign-in failed:", error);
      Alert.alert(
        "Error",
        "An error occurred while signing in. Please check your credentials and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-gray-300 h-full">
      <View className="w-full justify-center min-h-[80vh] p-6">
        <Image
          source={images.logo}
          resizeMode="contain"
          className="w-[115px] h-[35px]"
        />

        <Text className="text-2xl text-black font-semibold mt-10">
          Log in to KidneyCare
        </Text>

        <FormField
          title="Email"
          value={form.email}
          handleChangeText={(e) => setForm({ ...form, email: e })}
          otherStyles="mt-7"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCompleteType="email"
        />

        <FormField
          title="Password"
          value={form.password}
          handleChangeText={(e) => setForm({ ...form, password: e })}
          otherStyles="mt-7"
          secureTextEntry // Hide password input
        />

        <CustomButton
          title="Sign in"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={isSubmitting}
        />

        {isSubmitting && (
          <View className="absolute top-0 left-0 right-0 bottom-0  z-10 flex items-center justify-center">
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 20,
                backgroundColor: "#333",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#fff" />
              <Text style={{ color: "#fff", marginTop: 10 }}>Loading</Text>
            </View>
          </View>
        )}

        <View className="justify-center pt-5 flex-row gap-2">
          <Text className="text-l text-black font-pregular">
            Don't have an account?
          </Text>
          <Link
            href="/sign-up"
            className="text-l text-secondary font-psemibold"
          >
            Sign Up
          </Link>
        </View>
      </View>

      <StatusBar backgroundColor="#161622" style="dark" />
    </SafeAreaView>
  );
};

export default SignIn;
