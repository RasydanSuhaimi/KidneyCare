import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

const TestLottie = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/animations/animation2.json')} // Ensure this path is correct
        autoPlay
        loop
        style={styles.lottie}
      />
    </View>
  );
};

export default TestLottie;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: width * 0.9, // Adjust the size as needed
    height: width * 0.9,
  },
});
