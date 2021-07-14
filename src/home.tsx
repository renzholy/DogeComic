import { useInfiniteQuery } from 'react-query'
import React, { useEffect, useMemo } from 'react'
import cheerio from 'cheerio'
import { SafeAreaView, VirtualizedList } from 'react-native'
import { last, compact, flatten } from 'lodash'
import { useNavigation, NavigationProp } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Ionicons'

import { ParamList } from './type'
import { BookCard, BookItem } from './components/card'
import ListFooter from './components/list-footer'
import { parseSearchResult } from './utils/parse'

export default function Home() {
  const navigation = useNavigation<NavigationProp<ParamList, 'Home'>>()
  useEffect(() => {
    navigation.setOptions({
      title: '最新連載',
      headerRight: () => (
        <Icon.Button
          backgroundColor="transparent"
          name="search-outline"
          onPress={() => {
            navigation.navigate('Search', { q: '' })
          }}
        />
      ),
    })
  }, [navigation])
  const { data, isLoading, refetch, fetchNextPage } = useInfiniteQuery(
    'index',
    async ({ pageParam }) => {
      if (pageParam) {
        const response = await fetch(
          `https://dogemanga.com/_search?s=1&p=${pageParam}`,
          {
            method: 'POST',
          },
        )
        const json: { next: string; results: string[] } = await response.json()
        return compact(
          json.results.map((html) => parseSearchResult(cheerio.load(html))),
        )
      }
      const response = await fetch('https://dogemanga.com/?s=1')
      const html = await response.text()
      const $ = cheerio.load(html)
      return compact(
        $('.site-search-result')
          .toArray()
          .map((el) => parseSearchResult($, el)),
      )
    },
    { getNextPageParam: (prevData) => last(prevData)?.id },
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
        ListFooterComponent={isLoading ? undefined : <ListFooter />}
      />
    </SafeAreaView>
  )
}
