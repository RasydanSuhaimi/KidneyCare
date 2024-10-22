import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
} from "react-native";
import React, { useState, useRef } from "react";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import DatePicker from "../components/DatePicker";
import GenderPicker from "../components/GenderPicker";

const personalInfoSteps = [
  {
    title: "Personal Information",
    fields: [
      { label: "Date of Birth", type: "date", placeholder: "Date of Birth" },
      { label: "Age", placeholder: "Your age" },
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
    title: "Medical Information",
    fields: [
      { label: "Current GFR", placeholder: "Current GFR (mL/min/1.73 m²)" },
      { label: "Stage GFR", placeholder: "Stage GFR" },
      { label: "Current GFR Month", type: "date", placeholder: "Month" },
    ],
  },
  {
    title: "GFR Historical Record",
    fields: [
      { label: "History GFR Month", type: "date", placeholder: "Month" },
      { label: "GFR Value", placeholder: "GFR value" },
    ],
  },
];

const PersonalInfoOnboarding = () => {
  const [screenIndex, setScreenIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const isNavigatingToNextStep = useRef(false);
  const opacity = useRef(new Animated.Value(1)).current;

  const resetOnboarding = () => {
    setScreenIndex(0);
    setFormData({});
    isNavigatingToNextStep.current = false;
  };

  const handleTransition = (direction) => {
    Animated.timing(opacity, {
      toValue: 0, // Fade out
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      const isNext = direction === "next";
      setScreenIndex((prev) => (isNext ? prev + 1 : prev - 1));

      // Fade in after changing the step
      Animated.timing(opacity, {
        toValue: 1, // Fade in
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
    if (!isLastScreen) {
      handleTransition("next");
    } else {
      endOnboarding();
    }
  };

  const endOnboarding = () => {
    if (!isNavigatingToNextStep.current) {
      isNavigatingToNextStep.current = true;
      console.log("Collected Data: ", formData);
      router.push("../(tabs)/home");
    }
  };

  const handleInputChange = (field, value) => {
    if (field === "Weight (kg)" || field === "Height (cm)") {
      const numericValue = value.replace(/[^0-9.]/g, "");
      if (numericValue.length <= 6) {
        setFormData({
          ...formData,
          [field]: numericValue,
        });
      }
    } else if (field === "Current GFR") {
      const numericValue = value.replace(/[^0-9.]/g, "");
      if (numericValue.length <= 6) {
        const stage = numericValue ? calculateGfrStage(numericValue) : "";
        setFormData({
          ...formData,
          [field]: numericValue,
          "Stage GFR": stage,
        });
      } else {
        setFormData((prev) => ({
          ...prev,
          [field]: numericValue,
          "Stage GFR": "",
        }));
      }
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  // Function to determine GFR stage based on value
  const calculateGfrStage = (gfrValue) => {
    const value = parseFloat(gfrValue);
    if (value > 90) return "Stage 1";
    else if (value >= 60) return "Stage 2";
    else if (value >= 45) return "Stage 3a";
    else if (value >= 30) return "Stage 3b";
    else if (value >= 15) return "Stage 4";
    else return "Stage 5";
  };
  useFocusEffect(
    React.useCallback(() => {
      resetOnboarding();
    }, [])
  );

  const currentStep = personalInfoSteps[screenIndex];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.page}>
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
                    showMonthYearOnly={screenIndex === 1 || screenIndex === 2}
                    placeholder={field.placeholder}
                  />
                ) : field.label === "Stage GFR" ? (
                  <FormField
                    placeholder={field.placeholder}
                    value={formData["Stage GFR"] || ""}
                    editable={false} // Make it read-only
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
              </View>
            ))}
          </Animated.View>

          <CustomButton
            containerStyles={styles.button}
            title="Next"
            handlePress={onContinue}
          />

          <View style={styles.footer}>
            <View style={styles.stepIndicatorContainer}>
              {personalInfoSteps.map((_, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: index === screenIndex ? "#8B7FF5" : "grey",
                    height: index === screenIndex ? 10 : 6,
                    width: index === screenIndex ? 30 : 20,
                    borderRadius: 10,
                  }}
                />
              ))}
            </View>
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
    paddingTop: 0,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 70,
    marginTop: 30,
  },
  title: {
    color: "black",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
  inputContainer: {
    marginVertical: 10,
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
});

export default PersonalInfoOnboarding;
