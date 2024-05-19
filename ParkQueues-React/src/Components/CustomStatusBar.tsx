import { View, Text } from 'react-native'
import React from 'react'
import { fontFamily, platform_style } from '../styles'

const Header = (props: any): React.JSX.Element => {
  if (props.platform === 'ios') {
    return (
      <View>
        <Text style={{
          fontSize: platform_style.statusBar.fontSize,
          color: platform_style.statusBar.fontColor,
          fontFamily
        }}>
          {props.title}</Text>
      </View>
    )
  } else if (props.platform === 'android') {
    return (
      <View>
        <Text style={{
          fontSize: platform_style.statusBar.fontSize,
          color: platform_style.statusBar.fontColor,
          fontFamily
        }}>
          {props.title}</Text>
      </View>
    )
  } else if (props.platform === 'web') {
    return (
      <View>
        <Text style={{
          fontSize: platform_style.statusBar.fontSize,
          color: platform_style.statusBar.fontColor,
          fontFamily
        }}>
          {props.title}</Text>
      </View>
    )
  } else {
    return (
      <>
      </>
    )
  }
}

export default Header
