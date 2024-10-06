import { View, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";

const FoodListItem = ({ item }) => {
  return (
    <View style={styles.container} accessibilityLabel={`${item.food.label} - ${item.food.nutrients.ENERC_KCAL} calories`}>
      <View style={styles.content}>
        <Text style={styles.label}>{item.food.label}</Text>
        <Text style={styles.calories}>{item.food.nutrients.ENERC_KCAL} cal</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    //marginBottom: 10, 
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

FoodListItem.propTypes = {
  item: PropTypes.shape({
    food: PropTypes.shape({
      label: PropTypes.string.isRequired,
      nutrients: PropTypes.shape({
        ENERC_KCAL: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default FoodListItem;
