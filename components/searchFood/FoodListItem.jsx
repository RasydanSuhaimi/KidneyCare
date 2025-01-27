import { View, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";

const FoodListItem = ({ item, selectedNutrient }) => {
  const nutrientValue = item.food.nutrients[selectedNutrient]?.toFixed(2) || 0;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>{item.food.label}</Text>
        <Text style={styles.nutrient}>
          {selectedNutrient === "ENERC_KCAL"
            ? `${nutrientValue} cal`
            : `${nutrientValue} g`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    shadowColor: "black",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  nutrient: {
    fontSize: 14,
    color: "#777",
    marginTop: 10,
  },
});

FoodListItem.propTypes = {
  item: PropTypes.shape({
    food: PropTypes.shape({
      label: PropTypes.string.isRequired,
      nutrients: PropTypes.object.isRequired,
    }).isRequired,
  }).isRequired,
  selectedNutrient: PropTypes.string.isRequired,
};

export default FoodListItem;
