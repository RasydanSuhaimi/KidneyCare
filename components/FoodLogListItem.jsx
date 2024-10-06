import { View, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types"; // Import prop-types for validation

const FoodLogListItem = ({ item }) => {
  return (
    <View style={styles.container} accessibilityLabel={`${item.label} - ${item.kcal} calories`}>
      <View style={styles.content}>
        <Text style={styles.label}>{item.label}</Text>
        <Text style={styles.calories}>{item.kcal} cal</Text>
      </View>
    </View>
  );
};

// Define styles using StyleSheet for better performance
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    //marginBottom: 1, 
  },
  content: {
    flex: 1,
    
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  calories: {
    fontSize: 14,
    color: "#777", 
    marginTop: 10,
  },
});

// Define prop types for better validation
FoodLogListItem.propTypes = {
  item: PropTypes.shape({
    label: PropTypes.string.isRequired,
    kcal: PropTypes.number.isRequired,
  }).isRequired,
};

export default FoodLogListItem;
