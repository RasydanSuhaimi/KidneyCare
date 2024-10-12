import { Text, TouchableOpacity } from "react-native";
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
      className="items-center gap-2"
      style={name === "" ? { transform: [{ translateY: -15 }] } : {}}
    >
      {renderIcon()}

      {/* Show the name only for the non-SearchFood icons */}
      {name !== "" && (
        <Text
          className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
          style={{ color }}
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
      color: "#8B7FF5",
    },
    {
      name: "recommendedFood",
      iconSet: "AntDesign",
      iconName: "heart",
      title: "Picks",
    },
    {
      name: "insight",
      iconSet: "Entypo",
      iconName: "bar-graph",
      title: "Insight",
    },
  ];

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#8B7FF5",
        tabBarInactiveTintColor: "#989B9A",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          position: "absolute",
          //bottom: 20,
          //marginHorizontal: 12,
          borderRadius: 25,
          height: 95,
          paddingBottom: 15,
          //paddingTop: 0,
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

export default TabsLayout;
