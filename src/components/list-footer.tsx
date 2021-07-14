import React from 'react'
import { Text, View } from 'react-native'
import tailwind from 'tailwind-rn'

export default function ListFooter() {
  return (
    <View style={tailwind('h-16 w-full flex items-center')}>
      <Text style={tailwind('text-white')}>~</Text>
    </View>
  )
}
