import { useQuery } from 'react-query'
import React, { useState, useMemo, useEffect } from 'react'
import cheerio from 'cheerio'
import { Dimensions, SafeAreaView, VirtualizedList } from 'react-native'
import { compact } from 'lodash'
import Gallery from 'react-native-awesome-gallery'
import tailwind from 'tailwind-rn'
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import { TransitionPresets } from '@react-navigation/stack'
import Icon from 'react-native-vector-icons/Ionicons'
import Preference from 'react-native-preference'

import { ParamList } from './type'
import AutoHeightImage from './components/auto-height-image'
import ListFooter from './components/list-footer'
import { useCallback } from 'react'

const PREFERENCE_KEY = 'comic-view-mode'

export default function Comic() {
  const route = useRoute<RouteProp<ParamList, 'Comic'>>()
  const navigation = useNavigation<NavigationProp<ParamList, 'Comic'>>()
  const [currentPage, setCurrentPage] = useState(0)
  const {
    data: html,
    isLoading,
    refetch,
  } = useQuery(['comic', route.params.title, route.params.id], () =>
    fetch(
      `https://dogemanga.com/p/${encodeURIComponent(route.params.title)}/${
        route.params.id
      }`,
    ).then((response) => response.text()),
  )
  const data = useMemo(() => {
    if (!html) {
      return []
    }
    const $ = cheerio.load(html)
    return compact(
      $('.site-page-slide')
        .toArray()
        .map((el) => {
          return $(el).attr('data-src')
        }),
    )
  }, [html])
  const [isGallery, setIsGallery] = useState(
    Preference.get(PREFERENCE_KEY) === 'gallery',
  )
  useEffect(() => {
    Preference.setWhiteList([PREFERENCE_KEY])
  }, [])
  const handlePreferenceChange = useCallback(
    (changed: { [key: string]: any }) => {
      setIsGallery(changed[PREFERENCE_KEY] === 'gallery')
    },
    [],
  )
  useEffect(() => {
    Preference.addPreferenceChangedListener(handlePreferenceChange)
    return () => {
      Preference.removePreferenceChangedListener(handlePreferenceChange)
    }
  }, [handlePreferenceChange])
  useEffect(() => {
    navigation.setOptions({
      title: `${route.params.title} (${currentPage + 1 || '-'}/${
        data.length || '-'
      })`,
      headerRight: () => (
        <Icon.Button
          backgroundColor="transparent"
          name={isGallery ? 'book-outline' : 'albums-outline'}
          onPress={() => {
            Preference.set(PREFERENCE_KEY, isGallery ? 'feed' : 'gallery')
          }}
        />
      ),
      ...TransitionPresets.SlideFromRightIOS,
    })
  }, [currentPage, data.length, isGallery, navigation, route.params.title])

  return (
    <SafeAreaView>
      {Preference.get(PREFERENCE_KEY) === 'gallery' ? (
        data.length ? (
          <Gallery
            initialIndex={currentPage}
            data={data}
            onIndexChange={setCurrentPage}
            style={tailwind('w-full h-full')}
          />
        ) : null
      ) : (
        <VirtualizedList<string>
          data={data}
          keyExtractor={(item) => item}
          getItem={(_data, index) => data[index]}
          renderItem={({ item }) => (
            <AutoHeightImage
              url={item}
              width={Dimensions.get('window').width}
              initialHeight={400}
            />
          )}
          initialScrollIndex={currentPage}
          getItemCount={() => data.length}
          refreshing={isLoading}
          onRefresh={refetch}
          onViewableItemsChanged={(info) => {
            setCurrentPage(info.viewableItems[0]?.index || 0)
          }}
          removeClippedSubviews={true}
          ListFooterComponent={isLoading ? undefined : <ListFooter />}
        />
      )}
    </SafeAreaView>
  )
}
