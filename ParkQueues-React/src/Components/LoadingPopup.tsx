import { ActivityIndicator, Dimensions, Text, View } from 'react-native'
import React from 'react'

const LoadingPopup = ({ message }: { message: string }): React.JSX.Element => {
  return (
    <View style={[{
      height: 600,
      width: Dimensions.get('screen').width,
      position: 'absolute',
      top: 0,
      right: 0,
      zIndex: 999,
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor: 'gray'
    }]}>
      <View style={{
        padding: 20,
        backgroundColor: 'rgba(10,10,10,0.75)',
        justifyContent: 'center',
        borderRadius: 20,
      }}>
        <ActivityIndicator size="large" color="white" />
        <Text style={{
          fontSize: 20,
          color: 'white',
          marginTop: 10,
          marginHorizontal: 20,
          textAlign: 'center'
        }}>{message}</Text>
      </View>
    </View>
  )
}

export default LoadingPopup
