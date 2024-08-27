import { Text, View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react'

import  StatusBar  from "../../components/StatusBar";

const Home = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data = {[{ id:1 }, { id:2 }, { id:3 }]}
        keyExtractor = {(item) => item.id}
        renderItem = {({item}) => (
          <Text className="text-3xl">
            {item.id}
          </Text>
        )}

        ListHeaderComponent={() => (
          <View className = "my-6 px-4 space-y-6 bg-secondary">
            <View className = "justify-between item-start flex-row mb-6 bg-secondary">
              <View>
                <Text className = "font-pmedium text-sm text-white">Tuesday, 3 January</Text>
                <Text className = "text-xl text-white font-psemibold">Hello, Rasydan</Text>
              </View>
              <Text className = "text-xl text-white font-psemibold"> Stage 2</Text>
            </View>
            <View>
              <StatusBar>
                
              </StatusBar>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  )
}

export default Home