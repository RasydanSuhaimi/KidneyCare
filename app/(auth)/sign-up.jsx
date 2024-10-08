import { StatusBar } from "expo-status-bar";
import {

  Text,
  View,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { gql, useMutation, useLazyQuery } from "@apollo/client";

import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";

// GraphQL Mutation for signing up a user
const SIGNUP_MUTATION = gql`
  mutation SignUpUser($username: String!, $email: String!, $password: String!) {
    insert_users(username: $username, email: $email, password: $password) {
      user_id
      username
      email
    }
  }
`;

// GraphQL Query to check if username exists
const CHECK_USERNAME_AND_EMAIL_QUERY = gql`
  query CheckUsernameAndEmail($username: String!, $email: String!) {
    checkUsername(username: $username) {
      username
    }
    checkEmail(email: $email) {
      email
    }
  }
`;

const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "", // Added confirmPassword field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const router = useRouter();

  const [signUpUser] = useMutation(SIGNUP_MUTATION);
  const [checkUsernameAndEmail] = useLazyQuery(CHECK_USERNAME_AND_EMAIL_QUERY);

  const validateForm = () => {
    if (
      !form.username ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      Alert.alert("Oops!", "All fields are required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      Alert.alert("Oops!", "Please enter a valid email address.");
      return false;
    }
    if (form.password.length < 8) {
      Alert.alert("Oops!", "Password must be at least 8 characters long.");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert("Oops!", "Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleError = (error) => {
    const message =
      error.graphQLErrors?.[0]?.message ||
      error.message ||
      "An unexpected error occurred.";
    if (message.includes("duplicate key value violates unique constraint")) {
      if (message.includes("users_username_key")) {
        Alert.alert(
          "Oops!",
          "This username is already in use. Please choose another one."
        );
      } else if (message.includes("users_email_key")) {
        Alert.alert(
          "Oops!",
          "This email is already associated with another account. Please use a different email."
        );
      } else {
        Alert.alert("Oops!", message);
      }
    } else {
      Alert.alert("Oops!", message);
    }
  };

  const submit = async () => {
    setIsSubmitting(true);
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      setIsChecking(true);
      const { data } = await checkUsernameAndEmail({
        variables: { username: form.username, email: form.email },
      });

      if (data?.checkUsername) {
        Alert.alert("Username Taken", "Please choose another username.");
        setIsChecking(false);
        setIsSubmitting(false);
        return;
      }

      if (data?.checkEmail) {
        Alert.alert("Email Taken", "Please use a different email.");
        setIsChecking(false);
        setIsSubmitting(false);
        return;
      }

      await signUpUser({
        variables: {
          username: form.username,
          email: form.email,
          password: form.password,
        },
      });

      Alert.alert("Success", "User created successfully!");
      router.push("/sign-in");
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
      setIsChecking(false);
    }
  };

  return (
    <SafeAreaView className="bg-gray-300 h-full">
      <View className="w-full justify-center min-h-[85vh] p-6">
        <Image
          source={images.logo}
          resizeMode="contain"
          className="w-[115px] h-[35px]"
        />

        <Text className="text-2xl text-black font-semibold mt-10">
          Sign up to KidneyCare
        </Text>

        <FormField
          title="Username"
          value={form.username}
          handleChangeText={(e) => setForm({ ...form, username: e })}
          otherStyles="mt-8"
        />

        <FormField
          title="Email"
          value={form.email}
          handleChangeText={(e) => setForm({ ...form, email: e })}
          otherStyles="mt-6"
          keyboardType="email-address"
        />

        <FormField
          title="Password"
          value={form.password}
          handleChangeText={(e) => setForm({ ...form, password: e })}
          otherStyles="mt-6"
          secureTextEntry
        />

        <FormField
          title="Confirm Password"
          value={form.confirmPassword}
          handleChangeText={(e) => setForm({ ...form, confirmPassword: e })}
          otherStyles="mt-6"
          secureTextEntry
        />

        <CustomButton
          title="Sign Up"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={isSubmitting}
        />

        {(isSubmitting || isChecking) && (
          <View className="absolute top-0 left-0 right-0 bottom-0 z-10 flex items-center justify-center">
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
            Have an account?
          </Text>
          <Link
            href="/sign-in"
            className="text-l text-secondary font-psemibold"
          >
            Sign In
          </Link>
        </View>
      </View>

      <StatusBar backgroundColor="#161622" style="dark" />
    </SafeAreaView>
  );
};

export default SignUp;
