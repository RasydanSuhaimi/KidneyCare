import React from 'react';
import { Modal, View, ActivityIndicator, Text } from 'react-native';

const LoadingIndicator = ({ visible }) => (
  <Modal transparent={true} visible={visible} animationType="fade">
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={{
        width: 100,
        height: 100,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#333",
      }}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Loading</Text>
      </View>
    </View>
  </Modal>
);

export default LoadingIndicator;
