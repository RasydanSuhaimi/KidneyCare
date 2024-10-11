import { View, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";

const FoodLogListItem = ({ label, serving, kcal }) => {
  return (
    <View
      style={styles.container}
      accessibilityLabel={`${label} - ${kcal} calories`}
    >
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.serving}>{serving} Serving</Text>
      </View>
      <Text style={styles.calories}>{kcal} cal</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,

  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  serving: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  calories: {
    fontSize: 14,
    color: "#777",
  },
});

// Define prop types for better validation
FoodLogListItem.propTypes = {
  label: PropTypes.string.isRequired,
  serving: PropTypes.number.isRequired,
  kcal: PropTypes.number.isRequired,
};

export default FoodLogListItem;
