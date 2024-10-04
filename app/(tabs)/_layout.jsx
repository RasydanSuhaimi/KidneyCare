import { Text, TouchableOpacity } from "react-native";
import { Tabs, useRouter } from "expo-router";
import AntDesign from "react-native-vector-icons/AntDesign"; // Import AntDesign icons
import Entypo from "react-native-vector-icons/Entypo"; // Import Entypo icons

// Modify TabIcon to accept both AntDesign and Entypo
const TabIcon = ({ iconSet, iconName, color, name, focused, onPress }) => {
  const iconSize = name === "" ? 70 : 25; // Larger size for SearchFood icon

  return (
    <TouchableOpacity
      onPress={onPress}
      className="items-center gap-2"
      style={name === "" ? { transform: [{ translateY: -15 }] } : {}} // Lift SearchFood icon
    >
      {/* Conditionally render the icon based on the iconSet prop */}
      {iconSet === "AntDesign" ? (
        <AntDesign name={iconName} size={iconSize} color={color} />
      ) : (
        <Entypo name={iconName} size={iconSize} color={color} />
      )}

      {/* Show the name only for the non-SearchFood icons */}
      {name !== "" && (
        <Text
          className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
          style={{ color: color }}
        >
          {name}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const TabsLayout = () => {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#8B7FF5",
        tabBarInactiveTintColor: "#989B9A",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          position: "absolute",
          bottom: 20,
          marginHorizontal: 12,
          borderRadius: 35,
          height: 75, // Increase height to make space for lifted icon
          paddingBottom: 0, // Ensure there's enough bottom padding for icons
          paddingTop: 0, // Add padding on top for space
          justifyContent: "center",
          flexDirection: "row",
          shadowColor: "#004365",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 5,
        },
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              iconSet="Entypo" // Specify the icon set
              iconName="home"
              color={color}
              name="Home"
              focused={focused}
              onPress={() => router.push("home")}
            />
          ),
        }}
      />

      {/* Journal Tab */}
      <Tabs.Screen
        name="journal"
        options={{
          title: "Journal",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              iconSet="Entypo" // Specify Entypo for this tab
              iconName="book"
              color={color}
              name="Journal"
              focused={focused}
              onPress={() => router.push("journal")}
            />
          ),
        }}
      />

      {/* SearchFood Tab - Larger and lifted */}
      <Tabs.Screen
        name="searchFood"
        options={{
          title: "SearchFood",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconSet="AntDesign" // Using AntDesign
              iconName="pluscircle"
              color="#8B7FF5"
              name=""
              focused={focused}
              onPress={() => router.push("searchFood")}
            />
          ),
        }}
      />

      {/* Recommended Food Tab */}
      <Tabs.Screen
        name="recommendedFood"
        options={{
          title: "Recommended Food",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              iconSet="AntDesign" // Using Entypo
              iconName="heart"
              color={color}
              name="Picks"
              focused={focused}
              onPress={() => router.push("recommendedFood")}
            />
          ),
        }}
      />

      {/* Insight Tab */}
      <Tabs.Screen
        name="insight"
        options={{
          title: "Insight",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              iconSet="Entypo" // Using AntDesign for this tab
              iconName="bar-graph"
              color={color}
              name="Insight"
              focused={focused}
              onPress={() => router.push("insight")}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
