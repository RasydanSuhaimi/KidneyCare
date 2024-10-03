import { View, TextInput } from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';

const SearchInput = ({ value, onChangeText, onSubmitEditing }) => {
    return (
        <View className="border h-14 px-6 border-white bg-white rounded-2xl focus:border-secondary items-center flex-row shadow mt-2 mx-2">
            <TextInput
                className="flex-1 text-black font-pregular text-base mt-0.5"
                value={value}
                onChangeText={onChangeText}
                placeholder="Search..."
                placeholderTextColor="#7b7b8b"
                returnKeyType="search"
                onSubmitEditing={onSubmitEditing} 
                blurOnSubmit={false} 
            />
            <AntDesign name="search1" size={24} color="#7b7b8b" />
        </View>
    );
};

export default SearchInput;
