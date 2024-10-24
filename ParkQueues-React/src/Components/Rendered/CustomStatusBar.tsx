import { View, Text } from 'react-native'
import React from 'react'
import { fontFamily, platformStyle } from '../../styles'

const Header = (props: any): React.JSX.Element => {
  // Determine font size based on the length of the title
  const calculateFontSize = (title: string): number => {
    const baseSize = (platformStyle.statusBar.fontSize ?? 30)
    const length = title.length

    // Adjust the size based on the length of the title
    if (length > 20) {
      return baseSize * 0.8 // 80% of the base size for long titles
    } else if (length > 15) {
      return baseSize * 0.9 // 90% of the base size for medium titles
    } else {
      return baseSize // Use base size for shorter titles
    }
  }

  const fontSize = calculateFontSize(props.title)

  return (
    <View>
      <Text
        style={{
          fontSize,
          color: platformStyle.statusBar.fontColor,
          fontFamily,
          textAlign: 'center' // Center the text
        }}
      >
        {props.title}
      </Text>
    </View>
  )
}

export default Header
