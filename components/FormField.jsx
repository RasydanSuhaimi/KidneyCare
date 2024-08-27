import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

import { icons } from '../constants';

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, ...props}) => {

    const [showPassword, setShowPassword] = useState(false)

    return (
        <View className={`space-y-2 ${otherStyles}`}>
            <Text className="text-base text-black font-pmedium">{title}</Text>

            <View className="border-2 w-full h-16 px-6 border-white bg-white rounded-2xl focus:border-secondary items-center flex-row shadow">
                <TextInput
                    className="flex-1 text-black font-psemibold text-base"
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor="#7b7b8b"
                    onChangeText={handleChangeText}
                    secureTextEntry={title === 'Password' && !showPassword}
                />

                {title === 'Password' && (
                    <TouchableOpacity onPress={() =>
                        setShowPassword(!showPassword)}>
                        <Image source={!showPassword ? icons.eye : icons.eyeHide } className="w-6 h-6"
                        resizeMode='contain'/>

                    </TouchableOpacity>
                )}

            </View>
        </View>
    )
}

export default FormField