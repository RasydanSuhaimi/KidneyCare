import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

const SearchInput = ({ value, onChangeText  }) => {

    return (

        <View className="border-2 w-full h-16 px-6 border-white bg-white rounded-2xl focus:border-secondary items-center flex-row shadow ">
            <TextInput
                className="flex-1 text-black font-pregular text-base mt-0.5"
                value={value}
                onChangeText={onChangeText} // This ensures the text input can update the state
                placeholder="Search"
                placeholderTextColor="#7b7b8b"
            />
        </View>
    )
}

export default SearchInput