import { View, Text } from 'react-native'
import React from 'react'
import { fontFamily, platformStyle } from '../styles'

const Header = (props: any): React.JSX.Element => {
  if (props.platform === 'ios') {
    return (
      <View>
        <Text style={{
          fontSize: platformStyle.statusBar.fontSize,
          color: platformStyle.statusBar.fontColor,
          fontFamily
        }}>
          {props.title}</Text>
      </View>
    )
  } else if (props.platform === 'android') {
    return (
      <View>
        <Text style={{
          fontSize: platformStyle.statusBar.fontSize,
          color: platformStyle.statusBar.fontColor,
          fontFamily
        }}>
          {props.title}</Text>
      </View>
    )
  } else if (props.platform === 'web') {
    return (
      <View>
        <Text style={{
          fontSize: platformStyle.statusBar.fontSize,
          color: platformStyle.statusBar.fontColor,
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
