import { useRef } from 'react'
import { Animated } from 'react-native'

const useExpandableAnimation = (): any => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const heightAnim = useRef(new Animated.Value(0)).current

  const animate = (toValue: number, height: number): void => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue, duration: 300, useNativeDriver: false }),
      Animated.timing(heightAnim, { toValue: height, duration: 300, useNativeDriver: false })
    ]).start()
  }

  return { fadeAnim, heightAnim, animate }
}

export default useExpandableAnimation
