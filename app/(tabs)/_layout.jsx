import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Tabs, useRouter } from "expo-router";
import AntDesign from "react-native-vector-icons/AntDesign"; // Import AntDesign icons
import Entypo from "react-native-vector-icons/Entypo"; // Import Entypo icons

const ICON_SIZE = {
  default: 25,
  large: 75,
};

const TabIcon = ({ iconSet, iconName, color, name, focused, onPress }) => {
  const iconSize = name === "" ? ICON_SIZE.large : ICON_SIZE.default; // Larger size for SearchFood icon

  const renderIcon = () => {
    if (iconSet === "AntDesign") {
      return <AntDesign name={iconName} size={iconSize} color={color} />;
    }
    return <Entypo name={iconName} size={iconSize} color={color} />;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.iconContainer,
        name === "" && styles.liftedIcon, 
      ]}
    >
      {renderIcon()}
      {name !== "" && (
        <Text
          style={[
            styles.tabText,
            focused ? styles.tabTextFocused : styles.tabTextUnfocused,
            { color },
          ]}
        >
          {name}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const TabsLayout = () => {
  const router = useRouter();

  const screens = [
    {
      name: "home",
      iconSet: "Entypo",
      iconName: "home",
      title: "Home",
    },
    {
      name: "journal",
      iconSet: "Entypo",
      iconName: "book",
      title: "Journal",
    },
    {
      name: "searchFood",
      iconSet: "AntDesign",
      iconName: "pluscircle",
      title: "",
      isLifted: true,
      color: "#3AAFA9",
    },
    {
      name: "insight",
      iconSet: "Entypo",
      iconName: "bar-graph",
      title: "Insight",
    },
    {
      name: "recommendedFood",
      iconSet: "AntDesign",
      iconName: "heart",
      title: "Info",
    },
   
  ];

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#3AAFA9",
        tabBarInactiveTintColor: "#989B9A",
        tabBarStyle: styles.tabBar,
      }}
    >
      {screens.map((screen) => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          options={{
            title: screen.title,
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                iconSet={screen.iconSet}
                iconName={screen.iconName}
                color={screen.name === "searchFood" ? screen.color : color}
                name={screen.title}
                focused={focused}
                onPress={() => router.push(screen.name)}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#FFFFFF",
    position: "absolute",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: 95,
    paddingBottom: 15,
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: "#004365",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  iconContainer: {
    alignItems: "center",
    gap: 2,
  },
  liftedIcon: {
    transform: [{ translateY: -15 }],
  },
  tabText: {
    textAlign: "center",
    fontSize: 12,
  },
  tabTextFocused: {
    fontWeight: "600",
  },
  tabTextUnfocused: {
    fontWeight: "400",
  },
});

export default TabsLayout;
