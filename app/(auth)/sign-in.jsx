import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { Text, View, Image, Alert, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { gql, useLazyQuery } from "@apollo/client";
import { useUser } from "../../context/UserContext";
import LoadingIndicator from "../../components/LoadingIndicator";
import { StyleSheet } from "react-native";

const SIGN_IN = gql`
  query SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      user_id
      username
      email
      ispersonalinfocomplete
    }
  }
`;

const SignIn = () => {
  const { setUserId } = useUser();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signInUser] = useLazyQuery(SIGN_IN);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const userId = await AsyncStorage.getItem("user_id");
        if (userId) {
          router.replace("/(tabs)/home");
        }
      } catch (error) {
        console.error("Error checking user session:", error);
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
        await AsyncStorage.setItem("user_id", String(data.signIn.user_id));
        await AsyncStorage.setItem(
          "ispersonalinfocomplete",
          data.signIn.ispersonalinfocomplete.toString()
        );

        setUserId(data.signIn.user_id);

        setIsSubmitting(false);

        setTimeout(() => {
          if (!data.signIn.ispersonalinfocomplete) {
            router.replace("/personalInfo");
            //router.replace("/(tabs)/home");
          } else {
            router.replace("/(tabs)/home");
          }
        }, 100);
      } else {
        Alert.alert("Invalid email or password", "Please try again.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Sign-in failed:", error);
      Alert.alert(
        "Error",
        "An error occurred while signing in. Please check your credentials and try again."
      );
      setIsSubmitting(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image source={images.logo} resizeMode="contain" style={styles.logo} />

        <Text style={styles.title}>Log in to KidneyCare</Text>

        <FormField
          title="Email"
          placeholder="Email"
          value={form.email}
          handleChangeText={(e) => setForm({ ...form, email: e })}
          otherStyles={styles.formField}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCompleteType="email"
        />

        <FormField
          title="Password"
          placeholder="Password"
          value={form.password}
          handleChangeText={(e) => setForm({ ...form, password: e })}
          otherStyles={styles.formField}
          secureTextEntry
        />

        <CustomButton
          title="Sign in"
          handlePress={submit}
          containerStyles={styles.button}
          isLoading={isSubmitting}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Link href="/sign-up" style={styles.signUpLink}>
            Sign Up
          </Link>
        </View>
      </View>

      <LoadingIndicator visible={isSubmitting} />

      <StatusBar backgroundColor="#161622" style="dark" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f8fa",
    flex: 1,
  },
  content: {
    justifyContent: "center",
    minHeight: "80%",
    padding: 24,
  },
  logo: {
    width: 115,
    height: 35,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "black",
    marginTop: 20,
    marginBottom: 15,
  },
  formField: {
    marginTop: 20,
  },
  button: {
    marginTop: 20,
  },
  footer: {
    justifyContent: "center",
    paddingTop: 20,
    flexDirection: "row",
  },
  footerText: {
    fontSize: 16,
    color: "black",
  },
  signUpLink: {
    fontSize: 16,
    color: "#3AAFA9",
    fontWeight: "600",
    marginLeft: 5,
  },
});

export default SignIn;
