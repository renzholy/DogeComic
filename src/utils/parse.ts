import { last } from 'lodash'
import type cheerio from 'cheerio'

import type { BookItem } from '../components/card'

export function parseSearchResult(
  $: cheerio.Root,
  el?: cheerio.Element,
): BookItem | null {
  const id = last($('a.site-link', el!).attr('href')?.split('/'))
  const title = $('h4 > a.site-link', el!).text().replace(/\s+/g, '')
  return id
    ? {
        id,
        title,
        authur: $('h5 > a.site-link', el!).text().replace(/\s+/g, ''),
        brief: $('p#search-result-brief', el!).text().trim(),
        status: $('ul.list-unstyled.mb-2 > li:nth-child(1)', el!)
          .text()
          .replace('連載狀態：', ''),
        update: $('ul.list-unstyled.mb-2 > li:nth-child(2)', el!).text(),
      }
    : null
}
