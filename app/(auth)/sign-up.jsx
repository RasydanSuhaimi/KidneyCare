import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { gql, useMutation, useLazyQuery } from "@apollo/client";

import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import LoadingIndicator from "../../components/LoadingIndicator";

// GraphQL Mutation for signing up a user
const SIGNUP_MUTATION = gql`
  mutation SignUpUser($username: String!, $email: String!, $password: String!) {
    insert_users(
      username: $username
      email: $email
      password: $password
      ispersonalinfocomplete: false
    ) {
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
    confirmPassword: "",
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image source={images.logo} resizeMode="contain" style={styles.logo} />

        <Text style={styles.title}>Sign up to KidneyCare</Text>

        <FormField
          title="Username"
          placeholder="Username"
          value={form.username}
          handleChangeText={(e) => setForm({ ...form, username: e })}
          otherStyles={styles.fieldSpacing}
        />

        <FormField
          title="Email"
          placeholder="Email"
          value={form.email}
          handleChangeText={(e) => setForm({ ...form, email: e })}
          otherStyles={styles.fieldSpacing}
          keyboardType="email-address"
        />

        <FormField
          title="Password"
          placeholder="Password"
          value={form.password}
          handleChangeText={(e) => setForm({ ...form, password: e })}
          otherStyles={styles.fieldSpacing}
          secureTextEntry
        />

        <FormField
          title="Confirm Password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          handleChangeText={(e) => setForm({ ...form, confirmPassword: e })}
          otherStyles={styles.fieldSpacing}
          secureTextEntry
        />

        <CustomButton
          title="Sign Up"
          handlePress={submit}
          containerStyles={styles.buttonSpacing}
          isLoading={isSubmitting}
        />

        {(isSubmitting || isChecking) && <LoadingIndicator visible={true} />}

        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Have an account?</Text>
          <Link href="/sign-in" style={styles.signInLink}>
            Sign In
          </Link>
        </View>
      </View>

      <StatusBar backgroundColor="#161622" style="dark" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#f8f8fa",
    flex: 1,
  },
  container: {
    justifyContent: "center",
    minHeight: "85%",
    padding: 24,
  },
  logo: {
    width: 115,
    height: 35,
  },
  title: {
    fontSize: 24,
    color: "black",
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 15,
  },
  fieldSpacing: {
    marginTop: 20,
  },
  buttonSpacing: {
    marginTop: 20,
  },
  signInContainer: {
    justifyContent: "center",
    paddingTop: 20,
    flexDirection: "row",
    gap: 8,
  },
  signInText: {
    fontSize: 16,
    color: "black",
    fontWeight: "400",
  },
  signInLink: {
    fontSize: 16,
    color: "#3AAFA9",
    fontWeight: "600",
  },
});

export default SignUp;
