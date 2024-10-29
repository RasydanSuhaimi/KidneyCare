import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
} from "react-native";
import React, { useState, useRef } from "react";
import { router } from "expo-router";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import DatePicker from "../components/DatePicker";
import GenderPicker from "../components/GenderPicker";
import YesNoPicker from "../components/YesNoPicker";
import { useMutation, gql } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingIndicator from "../components/LoadingIndicator";

const INSERT_PERSONAL_INFO = gql`
  mutation MyMutation(
    $user_id: Int!
    $date_of_birth: Date!
    $age: Int!
    $gender: String!
    $weight: Float!
    $height: Float!
    $current_gfr: Float!
    $stage_gfr: String!
    $gfr_month: Date!
    $dialysis: Boolean!
    $created_at: DateTime
    $updated_at: DateTime
  ) {
    insertPersonal_info(
      user_id: $user_id
      date_of_birth: $date_of_birth
      age: $age
      gender: $gender
      weight: $weight
      height: $height
      current_gfr: $current_gfr
      stage_gfr: $stage_gfr
      gfr_month: $gfr_month
      dialysis: $dialysis
      created_at: $created_at
      updated_at: $updated_at
    ) {
      id
    }
  }
`;

const INSERT_NUTRITION = gql`
  mutation MyMutation(
    $personal_info_id: Int!
    $recommended_calories: Float!
    $recommended_phosphorus: Int!
    $recommended_potassium: Int!
    $recommended_protein: Float!
    $recommended_sodium: Int!
    $recommended_water: Int!
    $created_at: DateTime!
    $updated_at: DateTime!
  ) {
    insertNutrition(
      personal_info_id: $personal_info_id
      recommended_calories: $recommended_calories
      recommended_phosphorus: $recommended_phosphorus
      recommended_potassium: $recommended_potassium
      recommended_protein: $recommended_protein
      recommended_sodium: $recommended_sodium
      recommended_water: $recommended_water
      updated_at: $updated_at
      created_at: $created_at
    ) {
      id
    }
  }
`;

const UPDATE_PERSONAL_INFO = gql`
  mutation MyMutation($user_id: Int!) {
    updatePersonalInfoComplete(user_id: $user_id) {
      user_id
    }
  }
`;

const personalInfoSteps = [
  {
    title: "Personal Information",
    fields: [
      { label: "Date of Birth", type: "date", placeholder: "Date of Birth" },
      { label: "Age", type: "numeric", placeholder: "Your age" },
      { label: "Gender", type: "Gender", placeholder: "Your gender" },
      {
        label: "Weight (kg)",
        placeholder: "Your weight (kg)",
        type: "numeric",
      },
      {
        label: "Height (cm)",
        placeholder: "Your height (cm)",
        type: "numeric",
      },
    ],
  },
  {
    title: "CKD Stage Record",
    fields: [
      {
        label: "Current GFR",
        type: "numeric",
        placeholder: "Current GFR (mL/min/1.73 m²)",
      },
      { label: "Stage GFR", placeholder: "Stage GFR" },
      { label: "Current GFR Month", type: "date", placeholder: "Month" },
    ],
  },
  {
    title: "Are You On Dialysis?",
    fields: [
      { label: "Dialysis Option", placeholder: "Please Choose One Option" },
    ],
  },
];

const PersonalInfoOnboarding = () => {
  const [screenIndex, setScreenIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const isNavigatingToNextStep = useRef(false);
  const opacity = useRef(new Animated.Value(1)).current;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [insertPersonalInfo] = useMutation(INSERT_PERSONAL_INFO);
  const [insertNutrition] = useMutation(INSERT_NUTRITION);
  const [UpdatePersonalInfoComplete] = useMutation(UPDATE_PERSONAL_INFO);

  const handleTransition = (direction) => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      const isNext = direction === "next";
      setScreenIndex((prev) => (isNext ? prev + 1 : prev - 1));

      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleBack = () => {
    if (screenIndex > 0) {
      handleTransition("back");
    }
  };

  const onContinue = () => {
    const isLastScreen = screenIndex === personalInfoSteps.length - 1;
    const newErrors = {};

    currentStep.fields.forEach((field) => {
      if (field.label === "Stage GFR") {
        return;
      }
      if (field.label === "Gender") {
        if (!formData[field.label]) {
          newErrors[field.label] = "Gender is required.";
        }
      } else if (field.label === "Dialysis Option") {
        if (!formData[field.label]) {
          newErrors[field.label] = "Dialysis option is required.";
        }
      } else {
        if (!formData[field.label]) {
          newErrors[field.label] = `${field.label} is required.`;
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    } else {
      setErrors({});
    }

    if (!isLastScreen) {
      handleTransition("next");
    } else {
      endOnboarding();
    }
  };

  const buttonTitle =
    screenIndex === personalInfoSteps.length - 1 ? "Finish" : "Next";

  const endOnboarding = async () => {
    if (!isNavigatingToNextStep.current) {
      isNavigatingToNextStep.current = true;
      setLoading(true);
      console.log("Loading started");

      try {
        const userId = await AsyncStorage.getItem("user_id");

        if (!userId) {
          throw new Error("User ID not found in AsyncStorage");
        }

        const personalInfoResponse = await insertPersonalInfo({
          variables: {
            user_id: userId,
            date_of_birth: formData["Date of Birth"],
            age: formData["Age"],
            gender: formData["Gender"],
            weight: parseFloat(formData["Weight (kg)"]),
            height: parseFloat(formData["Height (cm)"]),
            current_gfr: parseFloat(formData["Current GFR"]),
            stage_gfr: formData["Stage GFR"],
            gfr_month: formData["Current GFR Month"],
            dialysis: formData["Dialysis Option"] === "Yes",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        });

        if (!personalInfoResponse.data.insertPersonal_info.id) {
          throw new Error("Failed to insert personal information.");
        }

        console.log(
          "Data saved successfully:",
          personalInfoResponse.data.insertPersonal_info
        );

        const totalCalories = calculateTotalCalories(formData);
        const totalProtein = calculateTotalProtein(formData);
        const totalPotassium = calculateTotalPotassium(formData);
        const totalPhosphorus = calculateTotalPhosphorus(formData);
        const totalSodium = calculateTotalSodium(formData);
        const totalWater = calculateTotalWater(formData);

        const nutritionResponse = await insertNutrition({
          variables: {
            personal_info_id: personalInfoResponse.data.insertPersonal_info.id,
            recommended_calories: totalCalories,
            recommended_phosphorus: totalPhosphorus,
            recommended_potassium: totalPotassium,
            recommended_protein: totalProtein,
            recommended_sodium: totalSodium,
            recommended_water: totalWater,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        });

        console.log(
          "Nutrition data inserted successfully:",
          nutritionResponse.data.insertNutrition
        );

        const updateResponse = await UpdatePersonalInfoComplete({
          variables: { user_id: userId },
        });
        console.log(
          "Update successful for user:",
          updateResponse.data.updatePersonalInfoComplete.user_id
        );

        router.push("../(tabs)/home");
      } catch (error) {
        console.error(
          "Error inserting personal info or nutrition data:",
          error
        );
        Alert.alert(
          "Error",
          "Failed to save personal information and nutrition data. Please try again."
        );
      } finally {
        setLoading(false);
        isNavigatingToNextStep.current = false;
      }
    }
  };

  const handleInputChange = (field, value) => {
    let processedValue = value;

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: undefined,
    }));

    if (field === "Weight (kg)" || field === "Height (cm)") {
      processedValue = value.replace(/[^0-9.]/g, "").slice(0, 6);
    } else if (field === "Current GFR") {
      processedValue = value.replace(/[^0-9.]/g, "").slice(0, 6);
      const stage = processedValue ? calculateGfrStage(processedValue) : "";
      setFormData((prev) => ({
        ...prev,
        [field]: processedValue,
        "Stage GFR": stage,
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: processedValue }));
  };

  const calculateGfrStage = (gfrValue) => {
    const value = parseFloat(gfrValue);
    if (value > 90) return "Stage 1";
    else if (value >= 60) return "Stage 2";
    else if (value >= 45) return "Stage 3a";
    else if (value >= 30) return "Stage 3b";
    else if (value >= 15) return "Stage 4";
    else return "Stage 5";
  };

  const calculateTotalCalories = (data) => {
    const weight = parseFloat(data["Weight (kg)"]);
    if (isNaN(weight)) return 0;

    const minCalories = weight * 25;
    const maxCalories = weight * 35;
    return (minCalories + maxCalories) / 2;
  };

  const calculateTotalProtein = (data) => {
    const weight = parseFloat(data["Weight (kg)"]);
    if (isNaN(weight)) return 0;

    const isDialysis = data["Dialysis Option"] === "Yes";
    const minProtein = isDialysis ? weight * 1.2 : weight * 0.6;
    const maxProtein = isDialysis ? weight * 1.3 : weight * 0.8;

    return (minProtein + maxProtein) / 2;
  };

  const calculateTotalPotassium = (data) => {
    const stage = data["Stage GFR"];
    const isDialysis = data["Dialysis Option"] === "Yes";

    if (isDialysis) {
      return 2000;
    } else if (stage === "Stage 1" || stage === "Stage 2") {
      return 4000;
    } else if (
      stage === "Stage 3a" ||
      stage === "Stage 3b" ||
      stage === "Stage 4"
    ) {
      return 2000;
    }
    return 0;
  };

  const calculateTotalPhosphorus = (data) => {
    const lowerLimit = 800;
    const upperLimit = 1000;

    return (lowerLimit + upperLimit) / 2;
  };

  const calculateTotalSodium = () => {
    return 2000;
  };

  const calculateTotalWater = () => {
    const minWater = 500;
    const maxWater = 1000;
    return (minWater + maxWater) / 2;
  };

  const currentStep = personalInfoSteps[screenIndex];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.page}>
        {loading && <LoadingIndicator visible={loading} />}
        <View style={styles.pageContent}>
          <View style={styles.headerContainer}>
            {screenIndex > 0 && (
              <Ionicons
                name="arrow-back"
                size={28}
                color="black"
                onPress={handleBack}
              />
            )}
            <Text style={styles.title}>{currentStep.title}</Text>
          </View>

          <Animated.View
            style={{
              opacity,
              width: "100%",
            }}
          >
            {currentStep.fields.map((field, index) => (
              <View key={index} style={styles.inputContainer}>
                {field.label === "Gender" ? (
                  <GenderPicker
                    selectedGender={formData[field.label]}
                    setSelectedGender={(value) =>
                      handleInputChange(field.label, value)
                    }
                  />
                ) : field.type === "date" ? (
                  <DatePicker
                    selectedDate={formData[field.label]}
                    setSelectedDate={(date) =>
                      handleInputChange(field.label, date)
                    }
                    showMonthYearOnly={screenIndex === 1}
                    placeholder={field.placeholder}
                  />
                ) : field.label === "Stage GFR" ? (
                  <FormField
                    placeholder={field.placeholder}
                    value={formData["Stage GFR"] || ""}
                    editable={false} // Make it read-only
                  />
                ) : field.label === "Dialysis Option" ? (
                  <YesNoPicker
                    selectedOption={formData[field.label]}
                    setSelectedOption={(value) =>
                      handleInputChange(field.label, value)
                    }
                  />
                ) : (
                  <FormField
                    placeholder={field.placeholder}
                    keyboardType={
                      field.type === "numeric" ? "numeric" : "default"
                    }
                    onChangeText={(value) =>
                      handleInputChange(field.label, value)
                    }
                    value={formData[field.label] || ""}
                  />
                )}

                {errors[field.label] && (
                  <Text style={styles.errorText}>{errors[field.label]}</Text>
                )}
              </View>
            ))}
          </Animated.View>

          <View style={styles.footer}>
            <View style={styles.stepIndicatorContainer}>
              {personalInfoSteps.map((_, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: index === screenIndex ? "#3AAFA9" : "grey",
                    height: index === screenIndex ? 10 : 6,
                    width: index === screenIndex ? 30 : 20,
                    borderRadius: 10,
                  }}
                />
              ))}
            </View>
            <CustomButton
              containerStyles={styles.button}
              title={buttonTitle}
              handlePress={onContinue}
            />
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  page: {
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#f8f8fa",
  },
  pageContent: {
    padding: 24,
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 50,
    marginTop: 10,
  },
  title: {
    color: "black",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
  inputContainer: {
    marginTop: 20,
  },

  gfrStageText: {
    marginTop: 5,
    fontSize: 14,
    color: "black",
  },
  button: {
    marginTop: 20,
  },
  stepIndicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },

  stepIndicatorContainer: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 160,
    margin: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    marginTop: "auto",
  },

  errorText: {
    color: "red",
    fontSize: 12,
    marginLeft: 10,
  },
});

export default PersonalInfoOnboarding;
