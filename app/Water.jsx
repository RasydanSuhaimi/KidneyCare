import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Progress from "../components/Water/Progress";
import { useQuery, gql, useMutation } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import WaterModal from "../components/Water/WaterModal";
import { Swipeable } from "react-native-gesture-handler";
import moment from "moment-timezone";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import HorizontalDatePicker from "../components/Water/HorizontalDatePicker";
import dayjs from "dayjs";

// GraphQL Queries and Mutations
const GET_TOTAL_WATER = gql`
  query getTotalWaterByDate($user_id: Int!) {
    getTotalWaterByDate(user_id: $user_id) {
      total_water
    }
  }
`;

const GET_WATER = gql`
  query getRecommendedWater($user_id: Int!) {
    getRecommendedWater(user_id: $user_id) {
      recommended_water
    }
  }
`;

const GET_WATER_VOLUME = gql`
  query getWaterVolumeBByDate($user_id: Int!, $date_log: DateTime!) {
    getWaterVolumeBByDate(user_id: $user_id, date_log: $date_log) {
      id
      water_volume
      date_log
    }
  }
`;

const ADD_WATER = gql`
  mutation AddWaterIntake(
    $user_id: Int!
    $water_volume: Float!
    $date_log: DateTime!
  ) {
    AddWaterIntake(
      user_id: $user_id
      water_volume: $water_volume
      date_log: $date_log
    ) {
      user_id
      water_volume
      date_log
    }
  }
`;

const DELETE_WATER = gql`
  mutation MyMutation($id: Int!) {
    deleteWater_log(id: $id) {
      id
    }
  }
`;

const Water = () => {
  const [userId, setUserId] = useState(null);
  const [totalWater, setTotalWater] = useState(0);
  const [targetWater, setTargetWater] = useState(1000);
  const [showInput, setShowInput] = useState(false);
  const [waterIntake, setWaterIntake] = useState("");
  const [waterVolumeData, setWaterVolumeData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("YYYY-MM"));
  

  // Fetch user ID from AsyncStorage
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("user_id");
      if (id) setUserId(parseInt(id));
    };
    fetchUserId();
  }, []);

  // GraphQL Queries
  const { data: totalWaterData, refetch: refetchTotalWater } = useQuery(
    GET_TOTAL_WATER,
    {
      variables: { user_id: userId },
      skip: !userId,
    }
  );

  const { data: recommendedWaterData, refetch: refetchRecommendedWater } =
    useQuery(GET_WATER, {
      variables: { user_id: userId },
      skip: !userId,
    });

  const { data: waterVolumeQueryData, refetch: refetchWaterVolume } = useQuery(
    GET_WATER_VOLUME,
    {
      variables: { user_id: userId, date_log: selectedDate },
      skip: !userId,
    }
  );

  useEffect(() => {
    console.log("Water Volume Data Refetched:", waterVolumeQueryData);
  }, [waterVolumeQueryData]);

  // GraphQL Mutations
  const [addWaterIntake] = useMutation(ADD_WATER);
  const [deleteWaterIntake] = useMutation(DELETE_WATER);

  // Refetch data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        refetchTotalWater();
        refetchRecommendedWater();
        refetchWaterVolume();
      }
    }, [userId])
  );

  // Update total water intake and volume data
  useEffect(() => {
    if (totalWaterData) {
      setTotalWater(totalWaterData.getTotalWaterByDate?.total_water || 0);
    }
  }, [totalWaterData]);

  useEffect(() => {
    if (recommendedWaterData) {
      setTargetWater(
        recommendedWaterData.getRecommendedWater[0]?.recommended_water || 1000
      );
    }
  }, [recommendedWaterData]);

  useEffect(() => {
    if (waterVolumeQueryData) {
      setWaterVolumeData(waterVolumeQueryData.getWaterVolumeBByDate || []);
    }
  }, [waterVolumeQueryData]);

  // Add water intake
  const handleAddWater = async () => {
    if (!waterIntake || isNaN(waterIntake)) {
      Alert.alert("Invalid input", "Please enter a valid number.");
      return;
    }

    const intakeAmount = parseInt(waterIntake);
    const now = dayjs().format("YYYY-MM-DD"); // Format to YYYY-MM-DD

    try {
      await addWaterIntake({
        variables: {
          user_id: userId,
          water_volume: intakeAmount,
          date_log: now, // Now formatted correctly
        },
      });
      setTotalWater((prev) => prev + intakeAmount);
      setWaterIntake("");
      setShowInput(false);
      refetchTotalWater();
      refetchWaterVolume(); // Refresh water volume
    } catch (error) {
      console.error("Error adding water intake:", error);
      Alert.alert("Error", "Failed to add water intake. Please try again.");
    }
  };

  // Delete water intake entry
  const handleDeleteWater = async (id) => {
    if (!id) {
      Alert.alert("Error", "No item ID provided.");
      return;
    }
    try {
      await deleteWaterIntake({
        variables: { id },
      });
      // Remove the deleted item from the waterVolumeData state
      const updatedWaterVolumeData = waterVolumeData.filter(
        (item) => item.id !== id
      );
      setWaterVolumeData(updatedWaterVolumeData);

      // Recalculate total water intake after deletion
      const newTotalWater = updatedWaterVolumeData.reduce(
        (acc, item) => acc + item.water_volume,
        0
      );
      setTotalWater(newTotalWater);

      Alert.alert("Success", "Water intake entry deleted.");
    } catch (error) {
      console.error("Error deleting water intake:", error);
      Alert.alert("Error", "Failed to delete water intake. Please try again.");
    }
  };

  useEffect(() => {
    const calculatedTotalWater = waterVolumeData.reduce(
      (acc, item) => acc + item.water_volume,
      0
    );
    setTotalWater(calculatedTotalWater);
  }, [waterVolumeData]);
  

  const generateDatesForMonth = (month) => {
    const startOfMonth = dayjs(month).startOf("month");
    const endOfMonth = dayjs(month).endOf("month");

    const dates = [];
    for (
      let date = startOfMonth;
      date.isBefore(endOfMonth.add(0, "day"));
      date = date.add(1, "day")
    ) {
      dates.push({
        fullDate: date.format("YYYY-MM-DD"),
        displayDate: date.format("ddd"),
        day: date.format("DD"),
      });
    }

    return dates;
  };

  const dateList = generateDatesForMonth(selectedMonth);

  useEffect(() => {
    console.log("Selected Date for Refetch:", selectedDate);
    if (userId) {
      refetchWaterVolume({
        user_id: userId,
        date_log: selectedDate, // Include the selected date
      }).then(() => {
        console.log("Water volume data refetched for:", selectedDate);
      });
    }
  }, [selectedDate, userId]);

  return (
    <SafeAreaView style={styles.container}>
      <HorizontalDatePicker
        dateList={dateList}
        selectedDate={selectedDate}
        setSelectedDate={(date) => {
          const formattedDate = dayjs(date).format("YYYY-MM-DD");
          console.log("Formatted Date:", formattedDate);
          setSelectedDate(formattedDate);

          if (userId) {
            refetchWaterVolume({
              user_id: userId,
              date_log: formattedDate, // Pass the formatted date
            }).then(() => {
              console.log("Water volume data refetched for:", formattedDate);
            });
          }
        }}
      />

      <Progress totalWater={totalWater} targetWater={targetWater} />

      <View style={styles.waterVolumeContainer}>
        <Text style={styles.sectionTitle}>Water Intake History:</Text>

        {/* Use FlatList for rendering water volume data */}
        <FlatList
          data={waterVolumeData}
          renderItem={({ item, index }) => (
            <Swipeable
              key={item.id}
              renderRightActions={() => (
                <View style={styles.rightActionContainer}>
                  <TouchableOpacity onPress={() => handleDeleteWater(item.id)}>
                    <MaterialIcons name="delete" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              )}
              containerStyle={styles.swipeableContainer}
            >
              <View style={styles.itemContainer}>
                <Text style={styles.waterVolumeText}>
                  {item.water_volume ? `${item.water_volume} ml` : "No data"}
                </Text>
                {index !== waterVolumeData.length - 1 && (
                  <View style={styles.separator} />
                )}
              </View>
            </Swipeable>
          )}
          keyExtractor={(item) =>
            item.id?.toString() || item.water_volume.toString()
          }
          extraData={waterVolumeData}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No water intake records yet.</Text>
          }
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Add Water"
          handlePress={() => setShowInput(true)}
        />
      </View>

      <WaterModal
        visible={showInput}
        onCancel={() => setShowInput(false)}
        onSubmit={handleAddWater}
        waterIntake={waterIntake}
        setWaterIntake={setWaterIntake}
      />
    </SafeAreaView>
  );
};

export default Water;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8fa",
    padding: 20,
  },
  waterVolumeContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 10,
  },
  waterVolumeText: {
    fontSize: 16,
    color: "#555",
    margin: 20,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
  },
  buttonContainer: {
    alignItems: "center",
  },
  rightActionContainer: {
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    width: 60,
    height: 60,
  },

  swipeableContainer: {
    marginVertical: 5,
    borderRadius: 10,
    overflow: "hidden",
  },
  itemContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },

  emptyText: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "500",
    paddingHorizontal: 30,
  },
});
