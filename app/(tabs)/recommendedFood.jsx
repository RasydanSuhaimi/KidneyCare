import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const InfoPage = () => {
  const openLink = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error("Cannot open URL:", url);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>About CKD and GFR</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What is CKD?</Text>
          <Text style={styles.sectionContent}>
            Chronic Kidney Disease (CKD) is a condition characterized by a gradual loss of kidney function over time. The kidneys are responsible for filtering waste and excess fluids from the blood, and CKD can lead to waste buildup in the body, causing various health problems.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What is GFR?</Text>
          <Text style={styles.sectionContent}>
            Glomerular Filtration Rate (GFR) is a measure of how well your kidneys are functioning. It estimates how much blood passes through the glomeruli (tiny filters in your kidneys) each minute. A lower GFR indicates reduced kidney function, which is a key indicator of CKD stages.
          </Text>
          <TouchableOpacity onPress={() => openLink("https://www.mdcalc.com/calc/76/mdrd-gfr-equation")}>
            <Text style={styles.link}>
              Learn more about GFR calculation here
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CKD Stages</Text>
          <Text style={styles.sectionContent}>
            CKD is classified into five stages based on GFR levels:
          </Text>
          <Text style={styles.listItem}>- Stage 1: GFR &ge; 90 (Normal or high function)</Text>
          <Text style={styles.listItem}>- Stage 2: GFR 60-89 (Mild reduction)</Text>
          <Text style={styles.listItem}>- Stage 3: GFR 30-59 (Moderate reduction)</Text>
          <Text style={styles.listItem}>- Stage 4: GFR 15-29 (Severe reduction)</Text>
          <Text style={styles.listItem}>- Stage 5: GFR &lt; 15 (Kidney failure)</Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Understanding CKD and GFR is crucial for managing your health and preventing further complications. Consult your doctor for personalized advice.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InfoPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40, // Add extra padding to ensure footer is visible above the tab bar
  },
  header: {
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  section: {
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    color: "#555",
    lineHeight: 22,
  },
  listItem: {
    fontSize: 16,
    color: "#555",
    lineHeight: 22,
    marginLeft: 12,
  },
  link: {
    fontSize: 16,
    color: "#007BFF",
    marginTop: 8,
    textDecorationLine: "underline",
  },
  footer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 70, // Add margin to ensure the footer is not hidden behind the tab bar
  },
  footerText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    lineHeight: 22,
  },
});
