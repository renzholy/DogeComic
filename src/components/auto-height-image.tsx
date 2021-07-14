import React from 'react'
import { Image } from 'react-native'
import { useQuery } from 'react-query'

export default function AutoHeightImage(props: {
  url: string
  width: number
  initialHeight?: number
}) {
  const { data } = useQuery<{ width: number; height: number }>(
    ['image', props.url],
    () =>
      new Promise<{ width: number; height: number }>((resolve, reject) => {
        Image.getSize(
          props.url,
          (width, height) => resolve({ width, height }),
          reject,
        )
      }),
  )

  return (
    <Image
      source={{
        uri: props.url,
        width: props.width,
        height: data
          ? (data.height / data.width) * props.width
          : props.initialHeight,
      }}
    />
  )
}
