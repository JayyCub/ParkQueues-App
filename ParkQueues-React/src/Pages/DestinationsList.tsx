import React, { useState, useEffect, useRef } from 'react'
import { Animated, Pressable, ScrollView, Text, View } from 'react-native'
import { styles } from '../styles'
import { useDataContext } from '../Data/DataContext'
import { type Destination } from '../Data/Destination'
import { type Park } from '../Data/Park'

const DestinationsList = ({ navigation }: any): React.JSX.Element => {
  const { destinations, lastUpdated } = useDataContext()
  const [expandedDestinations, setExpandedDestinations] = useState<Record<string, boolean>>({})
  const animations = useRef<Record<string, Animated.Value>>({})

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
      setExpandedDestinations(prevState => {
        const newState = {
          ...prevState,
          [slug]: !prevState[slug]
        }
        animateExpansion(slug, newState[slug])
        return newState
      })
    }
  }

  const animateExpansion = (slug: string, isExpanded: boolean): void => {
    if (!animations.current[slug]) {
      animations.current[slug] = new Animated.Value(0)
    }

    Animated.timing(animations.current[slug], {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false
    }).start()
  }

  const renderDestination = (destination: Destination): React.JSX.Element => {
    const parks = Object.values(destination.parks)
    const isExpanded = expandedDestinations[destination.slug]
    const animation = animations.current[destination.slug] || new Animated.Value(0)

    const height = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, (parks.length * 60) + 30] // Assuming each park item height is 50
    })

    if (parks.length === 1) {
      const park = parks[0]
      return (
        <Pressable
          key={destination.slug}
          style={styles.destinationCard}
          onPress={() => navigation.navigate('Park', { park, destId: destination.slug })}
        >
          <View>
            <Text style={styles.destinationTitle}>
              {park.name.replace(/Disney's|Water Park| Park/g, '')}
            </Text>
          </View>
        </Pressable>
      )
    }

    return (
      <View key={destination.slug} style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <Pressable
          style={[styles.destinationCard, isExpanded ? styles.destinationCardSelected : null]}
          onPress={() => { toggleExpand(destination) }}
        >
          <View>
            <Text style={styles.destinationTitle}>{destination.name}</Text>
          </View>
        </Pressable>
        <View style={styles.shadowWrapper}>
          <Animated.View style={[styles.expandedParkList, { height }]}>
            {parks.map((park: Park, index: number) => (
              <Pressable
                key={park.id}
                style={[styles.parkListCardFirst, index === 0 ? null : styles.parkListCard]}
                onPress={() => navigation.navigate('Park', { park, destId: destination.slug })}
              >
                <Text style={styles.parkListCardText}>
                  {park.name.replace(/Disney's|Water Park| Park| Theme/g, '')}
                </Text>
              </Pressable>
            ))}
          </Animated.View>
        </View>
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
