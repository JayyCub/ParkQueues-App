import React, { type FC, useCallback, useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, FlatList, StyleSheet, View, Text } from 'react-native'
import { type ImageCarouselItem } from '../Data/ImageCarouselItem'

const { width } = Dimensions.get('window')

const ITEM_LENGTH = width * 0.9 // Item is a square. Therefore, its height and width are of the same length.
const EMPTY_ITEM_LENGTH = (width - ITEM_LENGTH) / 2
const CURRENT_ITEM_TRANSLATE_Y = 0

interface ImageCarouselProps {
  data: ImageCarouselItem[]
}

const ImageCarousel: FC<ImageCarouselProps> = ({ data }) => {
  const scrollX = useRef(new Animated.Value(0)).current
  const [dataWithPlaceholders, setDataWithPlaceholders] = useState<ImageCarouselItem[]>([])
  const [currentPosition, setCurrentPosition] = useState(1) // Track current position for "x of y"
  const currentIndex = useRef<number>(0)
  const flatListRef = useRef<FlatList<any>>(null)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    setDataWithPlaceholders([{ id: -1 }, ...data, { id: data.length }])
    currentIndex.current = 1
  }, [data])

  const handleOnViewableItemsChanged = useCallback(
    ({ viewableItems }: any) => {
      const itemsInView = viewableItems.filter(
        ({ item }: { item: ImageCarouselItem }) => item.title
      )

      if (itemsInView.length === 0) {
        return
      }

      currentIndex.current = itemsInView[0].index
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setCurrentPosition(itemsInView[0].index) // Update current position based on viewable items
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
        style={{paddingBottom: 5}}
        ref={flatListRef}
        data={dataWithPlaceholders}
        renderItem={({ item, index }) => {
          if (item.title == null) {
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
      {/* Display the "x of y" text above the carousel */}
      <Text style={styles.positionText}>
        {currentPosition} of {data.length}
      </Text>

    </View>
  )
}

export default ImageCarousel

const styles = StyleSheet.create({
  container: {},
  flatListContent: {
    alignItems: 'center',
    paddingBottom: 10
  },
  shadowContainer: {
    shadowColor: '#aeb5be',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 1
  },
  positionText: {
    fontSize: 14,
    // fontWeight: 'bold',
    textAlign: 'right',
    // marginVertical: 5, // Add space between the text and carousel
    marginRight: 10
  }
})
