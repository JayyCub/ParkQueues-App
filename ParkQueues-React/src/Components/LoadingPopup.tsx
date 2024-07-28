// import { ActivityIndicator, Dimensions, Text, View } from 'react-native'
import React from 'react'
import { Modal, View, Text, ActivityIndicator } from 'react-native'
import { styles } from '../styles'

const LoadingPopup = ({ message }: { message: string }): React.JSX.Element => {
  return (
    // <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={true}
        onRequestClose={() => {}}>
        <View style={styles.centeredView}>
          <View style={{
            padding: 20,
            backgroundColor: 'rgba(10,10,10,0.75)',
            justifyContent: 'center',
            borderRadius: 20
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
      </Modal>
    // </View>
  )
}

export default LoadingPopup
