import { Text, View, Image, TouchableOpacity } from "react-native";
import { Tabs, useRouter } from "expo-router";
import { icons } from "../../constants";

const TabIcon = ({ icon, color, name, focused, onPress }) => {
  const iconSize = name === "" ? 65 : 24; // Adjust size for "searchFood" icon

  return (
    <TouchableOpacity
      onPress={onPress}
      className="items-center gap-2 top-2"
    >
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="W-6 h-6"
        style={{ width: iconSize, height: iconSize, marginTop: 40}} // Move the icon down
      />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
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
          bottom: 25,
          marginHorizontal: 12,
          borderRadius: 18,
          height: 70,
          justifyContent: "center", // Center items vertically
          alignItems: "center", // Center items horizontally
          flexDirection: "row", // Horizontal layout for tabs
          shadowColor: "#000", // Optional: adds shadow for depth
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 5, // Android shadow
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.home}
              color={color}
              name="Home"
              focused={focused}
              onPress={() => router.push("home")}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: "Journal",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.journal}
              color={color}
              name="Journal"
              focused={focused}
              onPress={() => router.push("journal")}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="searchFood"
        options={{
          title: "SearchFood",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={icons.plus}
              color="#8B7FF5"
              name=""
              focused={focused}
              onPress={() => router.push("searchFood")}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="recommendedFood"
        options={{
          title: "Recommended Food",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.recommend}
              color={color}
              name="Food"
              focused={focused}
              onPress={() => router.push("recommendedFood")}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="insight"
        options={{
          title: "Insight",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.insight}
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
