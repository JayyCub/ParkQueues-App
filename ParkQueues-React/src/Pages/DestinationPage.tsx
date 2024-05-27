import { Pressable, ScrollView, Text, View } from 'react-native'
import { styles } from '../styles'
import React, { useState } from 'react'
import { type Destination } from '../Data/Destination'
import { type Park } from '../Data/Park'

const DestinationPage = ({ route, navigation }: any): React.JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const [destination] = useState<Destination>(route.params?.destination)

  return (
    <>
      <View style={styles.subheaderView}>
        <Text
          style={styles.subheaderText}
        >@ {destination.name}</Text>
      </View>
      <ScrollView>
        <View style={styles.main}>
          {Object.values(destination.parks).map((park: Park) => (
            <Pressable
              key={park.id}
              style={styles.parkCard}
              onPress={() =>
                navigation.navigate('Park', { park })
              }
            >
              <View>
                <Text style={styles.destinationTitle}>
                  {park.name
                    .replaceAll("Disney's", '')
                    .replaceAll('Theme Park', '')
                    .replaceAll('Water Park', '')}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </>
  )
}

export default DestinationPage
