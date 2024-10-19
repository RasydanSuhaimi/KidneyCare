import React from "react";
import { Modal, View, ActivityIndicator, Text, StyleSheet } from "react-native";

const LoadingIndicator = ({ visible }) => (
  <Modal transparent={true} visible={visible} animationType="fade">
    <View style={styles.modalBackground}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading</Text>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
  },
});

export default LoadingIndicator;
