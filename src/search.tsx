import { useInfiniteQuery } from 'react-query'
import React, { useState, useMemo, useEffect } from 'react'
import cheerio from 'cheerio'
import { SafeAreaView, TextInput, VirtualizedList } from 'react-native'
import { compact, flatten } from 'lodash'
import {
  useRoute,
  RouteProp,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native'
import tailwind from 'tailwind-rn'

import type { ParamList } from './type'
import { BookCard, BookItem } from './components/card'
import ListFooter from './components/list-footer'
import { parseSearchResult } from './utils/parse'

export default function Search() {
  const route = useRoute<RouteProp<ParamList, 'Search'>>()
  const navigation = useNavigation<NavigationProp<ParamList, 'Search'>>()
  useEffect(() => {
    navigation.setOptions({
      title: 'Search',
      headerTitle: () => (
        <TextInput
          autoFocus={!route.params.q}
          blurOnSubmit={true}
          value={route.params.q}
          onChangeText={(q) => navigation.setParams({ q })}
          style={tailwind('text-white')}
        />
      ),
    })
  }, [navigation, route.params.q])
  const [query, setQuery] = useState('')
  useEffect(() => {
    setQuery(route.params.q)
  }, [route.params.q])
  const { data, isLoading, isIdle, refetch, fetchNextPage } = useInfiniteQuery(
    ['search', query],
    async ({ pageParam }) => {
      const response = await fetch(
        `https://dogemanga.com/_search?q=${query}&o=${pageParam || 0}`,
        {
          method: 'POST',
        },
      )
      const json: { next: string; results: string[] } = await response.json()
      return compact(
        json.results.map((html) => parseSearchResult(cheerio.load(html))),
      )
    },
    {
      getNextPageParam: (_data, pages) => flatten(pages).length,
      enabled: !!route.params.q,
    },
  )
  const items = useMemo(() => flatten(data?.pages), [data])

  return (
    <SafeAreaView>
      <VirtualizedList<BookItem>
        data={items}
        getItem={(_data, index) => items[index]}
        getItemCount={() => items.length}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookCard item={item} navigation={navigation} />
        )}
        onEndReached={() => fetchNextPage()}
        refreshing={isLoading}
        onRefresh={refetch}
        removeClippedSubviews={true}
        ListFooterComponent={isLoading || isIdle ? undefined : <ListFooter />}
      />
    </SafeAreaView>
  )
}
