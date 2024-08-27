import { Text, View, Image } from 'react-native';
import { Tabs, Redirect } from 'expo-router';

import { icons } from '../../constants';

const TabIcon = ({ icon, color, name, focused }) => {

  const iconSize = name === "" ? 65 : 24; // Adjust size for "AddFood" icon

  return(
    <View className="items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="W-6 h-6"
        style={{ width: iconSize, height: iconSize }}
      />
      <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`} style={{ color:color }}>
        {name}
      </Text>
    </View>
  )
}

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#8B7FF5',
          tabBarInactiveTintColor: '#989B9A',
          tabBarStyle:{
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            height: 95,
          }

        }}
      >
        <Tabs.Screen
          name='home' 
          options={{
            title:'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
              icon = {icons.home}
              color={color}
              name="Home"
              focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name='journal' 
          options={{
            title:'Journal',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
              icon = {icons.journal}
              color={color}
              name="Journal"
              focused={focused}
              />
            )
          }}
        />

        <Tabs.Screen
          name='addFood' 
          options={{
            title:'AddFood',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                icon={icons.plus}
                color="#8B7FF5"
                name=""
                focused={focused}
              />
            )
          }}
        />

        <Tabs.Screen
          name='recommendedFood' 
          options={{
            title:'recommendedFood',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
              icon = {icons.recommend}
              color={color}
              name="Food"
              focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name='insight' 
          options={{
            title:'Insight',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
              icon = {icons.insight}
              color={color}
              name="Insight"
              focused={focused}
              />
            )
          }}
        />
      </Tabs>
    </>
  )
}

export default TabsLayout
