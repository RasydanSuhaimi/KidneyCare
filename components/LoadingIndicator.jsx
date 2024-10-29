import React from "react";
import { Modal, View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

const LoadingIndicator = ({ visible = false }) => (
  <Modal transparent={true} visible={visible} animationType="fade">
    <View style={styles.modalBackground}>
      <View style={styles.loadingContainer}>
        <LottieView
          source={require("../assets/animations/kidneyGreen.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
  },
  loadingContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
  },
  lottie: {
    width: 80, 
    height: 80,
  },
});

export default LoadingIndicator;
