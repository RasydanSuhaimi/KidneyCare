import React from "react";
import { View, StyleSheet } from "react-native";
import { MotiView } from "moti";

const SkeletonLoader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        {/* Circle Skeleton Loader for Calorie Progress */}
        <View style={styles.circleContainer}>
          <MotiView
            style={styles.skeletonCircle}
            from={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{
              loop: true,
              type: "timing",
              duration: 800,
            }}
          />
          <View style={styles.kcalTextSkeleton}>
            <MotiView
              style={styles.skeletonText}
              from={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              transition={{
                loop: true,
                type: "timing",
                duration: 800,
              }}
            />
            <MotiView
              style={styles.skeletonTextSmall}
              from={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              transition={{
                loop: true,
                type: "timing",
                duration: 800,
              }}
            />
          </View>
        </View>

        {/* Skeleton bars for each nutrient */}
        <View style={styles.nutritionContainer}>
          {[...Array(3)].map((_, index) => (
            <View key={index} style={styles.progressBarRow}>
              <MotiView
                style={styles.skeletonBar}
                from={{ opacity: 0.3 }}
                animate={{ opacity: 1 }}
                transition={{
                  loop: true,
                  type: "timing",
                  duration: 800,
                }}
              />
              <MotiView
                style={styles.skeletonNutrientText}
                from={{ opacity: 0.3 }}
                animate={{ opacity: 1 }}
                transition={{
                  loop: true,
                  type: "timing",
                  duration: 800,
                }}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  progressContainer: {
    height: 150,
    borderRadius: 25,
    backgroundColor: "#3AAFA9",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  circleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  skeletonCircle: {
    width: 60,
    height: 960,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginBottom: 10,
  },
  kcalTextSkeleton: {
    alignItems: "center",
  },
  skeletonText: {
    width: 40,
    height: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginBottom: 5,
  },
  skeletonTextSmall: {
    width: 50,
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  nutritionContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    marginLeft: 20,
  },
  progressBarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginRight: 40,
  },
  skeletonBar: {
    height: 10,
    width: "70%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 5,
  },
  skeletonNutrientText: {
    width: 40,
    height: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginLeft: 5,
  },
});

export default SkeletonLoader;
