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

const GET_NUTRITION = gql`
  query getRecommendedNutrition($user_id: Int!) {
    getRecommendedNutrition(user_id: $user_id) {
      recommended_calories
      recommended_protein
    }
  }
`;

const GET_TOTAL_NUTRITION = gql`
  query getTotalNutritionByDate($user_id: Int!) {
    getTotalNutritionByDate(user_id: $user_id) {
      total_calories
      total_protein
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
  const [fetchNutritionData] = useLazyQuery(GET_NUTRITION);
  const [fetchTotalNutritionData] = useLazyQuery(GET_TOTAL_NUTRITION);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const userId = await AsyncStorage.getItem("user_id");

        if (userId) {
          // Navigate based on the personal info completion status
          const isPersonalInfoComplete = await AsyncStorage.getItem(
            "ispersonalinfocomplete"
          );
          if (isPersonalInfoComplete === "true") {
            router.replace("/(tabs)/home");
          } else {
            router.replace("/personalInfo");
          }
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
      // Perform sign-in
      const { data } = await signInUser({
        variables: { email: form.email, password: form.password },
      });

      if (data?.signIn) {
        const { user_id, username, ispersonalinfocomplete } = data.signIn;

        // Store user details in AsyncStorage
        await AsyncStorage.setItem("user_id", String(user_id));
        await AsyncStorage.setItem("username", username);
        await AsyncStorage.setItem(
          "ispersonalinfocomplete",
          ispersonalinfocomplete.toString()
        );

        setUserId(user_id);

        // Fetch recommended nutrition data
        const { data: nutritionData, error: nutritionError } =
          await fetchNutritionData({
            variables: { user_id },
          });

        if (nutritionError) {
          console.error("Error fetching nutrition data:", nutritionError);
        }

        console.log("Nutrition Data Response:", nutritionData);

        if (nutritionData?.getRecommendedNutrition) {
          const nutritionItem = nutritionData.getRecommendedNutrition[0];
          const { recommended_calories, recommended_protein } = nutritionItem;

          // Store recommended nutrition data in AsyncStorage
          await AsyncStorage.setItem(
            "target_calories",
            String(recommended_calories)
          );
          await AsyncStorage.setItem(
            "target_protein",
            String(recommended_protein)
          );

          // Log stored values for verification
          const storedCalories = await AsyncStorage.getItem("target_calories");
          const storedProtein = await AsyncStorage.getItem("target_protein");

          console.log("Stored target_calories:", storedCalories);
          console.log("Stored target_protein:", storedProtein);
        }

        // Fetch total nutrition data
        const { data: totalNutritionData, error: totalNutritionError } =
          await fetchTotalNutritionData({
            variables: { user_id },
          });

        if (totalNutritionError) {
          console.error(
            "Error fetching total nutrition data:",
            totalNutritionError
          );
        } else if (totalNutritionData?.getTotalNutritionByDate) {
          const { total_calories, total_protein } =
            totalNutritionData.getTotalNutritionByDate;

          // Store total nutrition data in AsyncStorage
          await AsyncStorage.setItem("total_calories", String(total_calories));
          await AsyncStorage.setItem("total_protein", String(total_protein));

          // Log stored values for verification
          const storedTotalCalories =
            await AsyncStorage.getItem("total_calories");
          const storedTotalProtein =
            await AsyncStorage.getItem("total_protein");

          console.log("Stored total_calories:", storedTotalCalories);
          console.log("Stored total_protein:", storedTotalProtein);
        }

        setIsSubmitting(false);

        // Add a delay before navigating to the next screen
        setTimeout(() => {
          if (ispersonalinfocomplete) {
            router.replace("/(tabs)/home");
          } else {
            router.replace("/personalInfo");
          }
        }, 100); // 2000 milliseconds (2 seconds) delay
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
