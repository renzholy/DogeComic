import { useQuery } from 'react-query'
import React, { useEffect } from 'react'
import cheerio from 'cheerio'
import { useMemo } from 'react'
import { SafeAreaView, VirtualizedList } from 'react-native'
import { last, compact } from 'lodash'
import {
  useRoute,
  RouteProp,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native'
import { TransitionPresets } from '@react-navigation/stack'

import { ParamList } from './type'
import ListFooter from './components/list-footer'
import { EpisodeCard } from './components/card'

type Item = {
  id: string
  title: string
}

export default function Detail() {
  const route = useRoute<RouteProp<ParamList, 'Detail'>>()
  const navigation = useNavigation<NavigationProp<ParamList, 'Detail'>>()
  useEffect(() => {
    navigation.setOptions({
      title: route.params.title,
      ...TransitionPresets.SlideFromRightIOS,
    })
  }, [navigation, route.params.title])
  const {
    data: html,
    isLoading,
    refetch,
  } = useQuery(['detail', route.params.id], () =>
    fetch(`https://dogemanga.com/m/${route.params.id}`).then((response) =>
      response.text(),
    ),
  )
  const data = useMemo(() => {
    if (!html) {
      return []
    }
    const $ = cheerio.load(html)
    return compact(
      $('#site-manga-all #site-manga-preview-box')
        .toArray()
        .map((el) => {
          const id = last($('a.site-link', el).attr('href')?.split('/'))
          const title = $('a.site-link', el).text().replace(/\s+/g, '')
          return id
            ? {
                id,
                title,
              }
            : null
        }),
    )
  }, [html])

  return (
    <SafeAreaView>
      <VirtualizedList<Item>
        data={data}
        listKey="id"
        getItem={(_data, index) => data[index]}
        renderItem={({ item }) => (
          <EpisodeCard
            item={item}
            onPress={() => {
              navigation.navigate('Comic', item)
            }}
          />
        )}
        getItemCount={() => data.length}
        refreshing={isLoading}
        onRefresh={refetch}
        removeClippedSubviews={true}
        ListFooterComponent={isLoading ? undefined : <ListFooter />}
      />
    </SafeAreaView>
  )
}
