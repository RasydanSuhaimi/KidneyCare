import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
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
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Apollo's useMutation hook for signing up a user
  const [signUpUser] = useMutation(SIGNUP_MUTATION);

  // Apollo's useLazyQuery hook for checking if the username exists
  const [checkUsernameAndEmail, { data: checkData, error: checkError }] =
    useLazyQuery(CHECK_USERNAME_AND_EMAIL_QUERY);

  const submit = async () => {
    setIsSubmitting(true);

    // Form validation
    if (!form.username || !form.email || !form.password) {
      Alert.alert("Error", "All fields are required.");
      setIsSubmitting(false);
      return;
    }

    // Email validation (simple regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    // Password length validation
    if (form.password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Check if username or email is taken
      const { data } = await checkUsernameAndEmail({
        variables: { username: form.username, email: form.email },
      });

      if (data?.checkUsername) {
        Alert.alert("Error", "Username already taken.");
        setIsSubmitting(false);
        return;
      }

      if (data?.checkEmail) {
        Alert.alert("Error", "Email already taken.");
        setIsSubmitting(false);
        return;
      }

      // Execute the GraphQL mutation for sign up
      const { data: signUpData } = await signUpUser({
        variables: {
          username: form.username,
          email: form.email,
          password: form.password,
        },
      });

      // Success feedback
      Alert.alert("Success", "User created successfully!");

      // Redirect to sign-in page
      router.push("/sign-in");
    } catch (error) {
      // Handle query error for checkUsername
      if (usernameCheckError) {
        Alert.alert(
          "Error",
          usernameCheckError.message || "Something went wrong."
        );
      } else {
        Alert.alert("Error", error.message || "Something went wrong.");
      }
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
            Sign up to KidneyCare
          </Text>

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-10"
          />

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
            title="Sign Up"
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
              Have account?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg text-secondary font-psemibold"
            >
              Sign In
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
    backgroundColor: "gray-300",
    zIndex: 10,
  },
};

export default SignUp;
