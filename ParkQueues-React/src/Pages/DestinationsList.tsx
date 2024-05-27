import React, { useState, useEffect } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { styles } from '../styles'
import { useDataContext } from '../Data/DataContext'
import { type Destination } from '../Data/Destination'
import { type Park } from '../Data/Park'

const DestinationsList = ({ navigation }: any): React.JSX.Element => {
  const { destinations, lastUpdated } = useDataContext()
  const [expandedDestinations, setExpandedDestinations] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // This effect will run whenever lastUpdated changes
  }, [lastUpdated])

  // Separate destinations into two lists: Disney and others
  const disneyDestinations: Destination[] = []
  const otherDestinations: Destination[] = []

  Array.from(destinations.values()).forEach((destination: Destination) => {
    if (destination.name.toLowerCase().includes('disney')) {
      disneyDestinations.push(destination)
    } else {
      otherDestinations.push(destination)
    }
  })

  const toggleExpand = (destination: Destination): void => {
    const { slug, parks } = destination
    if (Object.values(parks).length === 1) {
      navigation.navigate('Park', { park: Object.values(parks)[0] })
    } else {
      setExpandedDestinations(prevState => ({
        ...prevState,
        [slug]: !prevState[slug]
      }))
    }
  }

  const renderDestination = (destination: Destination): React.JSX.Element => {
    const parks = Object.values(destination.parks)
    if (parks.length === 1) {
      const park = parks[0]
      return (
        <Pressable
          key={destination.slug}
          style={styles.destinationCard}
          onPress={() => navigation.navigate('Park', { park })}
        >
          <View>
            <Text style={styles.destinationTitle}>
              {park.name.replaceAll("Disney's", '').replaceAll('Theme Park', '').replaceAll('Water Park', '')}
            </Text>
          </View>
        </Pressable>
      )
    }

    return (
      <View key={destination.slug} style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <Pressable
          style={expandedDestinations[destination.slug] ? styles.destinationCardSelected : styles.destinationCard}
          onPress={() => { toggleExpand(destination) }}
        >
          <View>
            <Text style={styles.destinationTitle}>{destination.name}</Text>
          </View>
        </Pressable>
        {expandedDestinations[destination.slug] && (
          <View style={styles.expandedParkList}>
            {parks.map((park: Park, index: number) => (
              <Pressable
                key={park.id}
                style={index === 0 ? styles.parkListCardFirst : styles.parkListCard}
                onPress={() => navigation.navigate('Park', { park })}
              >
                <Text style={styles.parkListCardText}>
                  {park.name.replaceAll("Disney's", '').replaceAll('Theme Park', '').replaceAll('Water Park', '')}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    )
  }

  return (
    <ScrollView>
      <View style={styles.main}>
        {disneyDestinations.length === 0
          ? <View style={{ height: 400, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 32 }}>Loading...</Text>
          </View>
          : <>
            {/* Disney Parks */}
            <View style={styles.destinationSectionView}>
              <Text style={styles.attrAvailSectionText}>Disney Parks</Text>
            </View>

            {disneyDestinations.map(renderDestination)}

            {/* Universal Destinations */}
            <View style={styles.destinationSectionView}>
              <Text style={styles.attrAvailSectionText}>Universal Parks</Text>
            </View>

            {otherDestinations.map(renderDestination)}
          </>
        }
      </View>
    </ScrollView>
  )
}

export default DestinationsList
