import { ScrollView, Text, View } from 'react-native'
import React from 'react'

const SettingsPage = ({ navigation }: any): React.JSX.Element => {
  return (
    <ScrollView>
      <View>
        <Text>This is my settings page.</Text>
      </View>
    </ScrollView>
  )
}

export default SettingsPage
