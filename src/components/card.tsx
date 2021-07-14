import type { NavigationProp } from '@react-navigation/native'
import React from 'react'
import { Image, Text, TouchableNativeFeedback, View } from 'react-native'
import tailwind from 'tailwind-rn'

import type { ParamList } from '../type'

export type BookItem = {
  id: string
  title: string
  authur: string
  brief: string
  status: string
  update: string
}

export function BookCard(props: {
  item: BookItem
  navigation: NavigationProp<ParamList>
}) {
  return (
    <TouchableNativeFeedback
      onPress={() => props.navigation.navigate('Detail', props.item)}>
      <View style={tailwind('p-4 flex flex-row')}>
        <Image
          source={{
            uri: `https://dogemanga.com/images/manga-thumbnails/${props.item.id}.jpg`,
            width: 120,
            height: 160,
          }}
          resizeMode="cover"
          style={tailwind('bg-gray-700')}
        />
        <View style={tailwind('ml-4 flex-1')}>
          <Text style={tailwind('text-white text-xl')}>{props.item.title}</Text>
          <TouchableNativeFeedback
            onPress={() =>
              props.navigation.navigate('Search', { q: props.item.authur })
            }>
            <Text style={tailwind('text-gray-300 text-lg')}>
              {props.item.authur}
            </Text>
          </TouchableNativeFeedback>
          <Text style={tailwind('text-gray-400')}>
            {props.item.status}，{props.item.update}
          </Text>
          <Text
            numberOfLines={3}
            ellipsizeMode="tail"
            style={tailwind('text-gray-600 mt-1')}>
            {props.item.brief}
          </Text>
        </View>
      </View>
    </TouchableNativeFeedback>
  )
}

export type EpisodeItem = {
  id: string
  title: string
}

export function EpisodeCard(props: { item: EpisodeItem; onPress: () => void }) {
  return (
    <TouchableNativeFeedback onPress={props.onPress}>
      <View style={tailwind('p-4 flex flex-row')}>
        <Image
          source={{
            uri: `https://dogemanga.com/images/page-thumbnails/${props.item.id}.jpg`,
            width: 120,
            height: 160,
          }}
          resizeMode="cover"
          style={tailwind('bg-gray-700')}
        />
        <View style={tailwind('ml-4 flex-1')}>
          <Text style={tailwind('text-white text-xl')}>{props.item.title}</Text>
        </View>
      </View>
    </TouchableNativeFeedback>
  )
}
