import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons';


const SearchInput = ({ value, onChangeText  }) => {

    return (

        <View className="border w-full h-14 px-6 border-white bg-white rounded-2xl focus:border-secondary items-center flex-row shadow mt-2 ">
            <TextInput
                className="flex-1 text-black font-pregular text-base mt-0.5"
                value={value}
                onChangeText={onChangeText} // This ensures the text input can update the state
                placeholder="Search"
                placeholderTextColor="#7b7b8b"
            />

        <AntDesign name="search1" size={24} color="#7b7b8b" />
        </View>
    )
}

export default SearchInput