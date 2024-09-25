import React, { type FC, useCallback, useEffect, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  View
} from 'react-native'
import { type ImageCarouselItem } from '../Pages/DestinationsList'

const { width } = Dimensions.get('window')

const SPACING = 2
const ITEM_LENGTH = width * 0.9 // Item is a square. Therefore, its height and width are of the same length.
const EMPTY_ITEM_LENGTH = (width - ITEM_LENGTH) / 2
const BORDER_RADIUS = 10
const CURRENT_ITEM_TRANSLATE_Y = 0

interface ImageCarouselProps {
  data: ImageCarouselItem[]
}

const ImageCarousel: FC<ImageCarouselProps> = ({ data }) => {
  const scrollX = useRef(new Animated.Value(0)).current
  const [dataWithPlaceholders, setDataWithPlaceholders] = useState<ImageCarouselItem[]>([])
  const currentIndex = useRef<number>(0)
  const flatListRef = useRef<FlatList<any>>(null)
  useEffect(() => {
    setDataWithPlaceholders([{ id: -1 }, ...data, { id: data.length }])
    currentIndex.current = 1
  }, [data])

  const handleOnViewableItemsChanged = useCallback(
    ({ viewableItems }) => {
      const itemsInView = viewableItems.filter(
        ({ item }: { item: ImageCarouselItem }) => item.title
      )

      if (itemsInView.length === 0) {
        return
      }

      currentIndex.current = itemsInView[0].index
    },
    [data]
  )

  const getItemLayout = (_data: any, index: number): any => ({
    length: ITEM_LENGTH,
    offset: ITEM_LENGTH * (index - 1),
    index
  })

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={dataWithPlaceholders}
        renderItem={({ item, index }) => {
          if (!item.title) {
            return <View style={{ width: EMPTY_ITEM_LENGTH }} />
          }

          const inputRange = [
            (index - 2) * ITEM_LENGTH,
            (index - 1) * ITEM_LENGTH,
            index * ITEM_LENGTH
          ]

          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [
              CURRENT_ITEM_TRANSLATE_Y * 2,
              CURRENT_ITEM_TRANSLATE_Y,
              CURRENT_ITEM_TRANSLATE_Y * 2
            ],
            extrapolate: 'clamp'
          })

          return (
            <View style={{ width: ITEM_LENGTH }}>
              <Animated.View
                style={[
                  {
                    transform: [{ translateY }]
                  },
                  styles.shadowContainer
                ]}>
                <View style={{ width: '100%', alignItems: 'center' }}>
                  {item.view}
                </View>
              </Animated.View>
            </View>
          )
        }}
        getItemLayout={getItemLayout}
        horizontal
        showsHorizontalScrollIndicator={true}
        keyExtractor={item => item.id}
        bounces={true}
        decelerationRate={0}
        renderToHardwareTextureAndroid
        contentContainerStyle={styles.flatListContent}
        snapToInterval={ITEM_LENGTH}
        snapToAlignment="start"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        onViewableItemsChanged={handleOnViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 100
        }}
      />
    </View>
  )
}

export default ImageCarousel

const styles = StyleSheet.create({
  container: {},
  flatListContent: {
    alignItems: 'center',
    paddingBottom: 40
  },
  shadowContainer: {
    shadowColor: '#aeb5be',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 1
  }
})
