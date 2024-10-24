import React, { useRef, useState } from 'react'
import {ActivityIndicator, Animated, Pressable, RefreshControl, ScrollView, Text, View} from 'react-native'
import { styles } from '../styles'
import { useDataContext } from '../Data/DataContext'
import { type Destination } from '../Data/Destination'
import { type Park } from '../Data/Park'
import Ionicons from '@expo/vector-icons/Ionicons'
import useExpandableAnimation from '../Components/Data/UseExpandableAnimation'
import { LocationDataSection } from '../Components/Rendered/LocationDataSection'

const DestinationsList = ({ route, navigation }: any): React.JSX.Element => {
  const { destinations, locationPermission, userData, lastUpdated, refreshData } = useDataContext()
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = (): void => {
    setRefreshing(true)
    refreshData().then(() => {
      setRefreshing(false)
    })
  }

  const favAttrs: string[] = []
  userData?.favs.forEach(attr => favAttrs.push(attr.id))

  const [expandedDestinations, setExpandedDestinations] = useState<Record<string, boolean>>({})
  const animations = useRef<Record<string, Animated.Value>>({})

  const [selectedCategory, setSelectedCategory] = useState<'Disney' | 'Universal' | null>(null)

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

  const calculateTotalHeight = (expandedDestinations: Record<string, boolean>, category: 'Disney' | 'Universal' | null): number => {
    if (category == null) return 0

    const selectedDestinations = category === 'Disney' ? disneyDestinations : otherDestinations
    let totalHeight = 10

    selectedDestinations.forEach((destination: Destination) => {
      const parksCount = Object.values(destination.parks).length
      if (expandedDestinations[destination.slug]) {
        totalHeight += 69 + (parksCount * 50)
      } else {
        totalHeight += 69 // Default height for a single destination card
      }
    })

    return totalHeight
  }

  const toggleExpand = (destination: Destination): void => {
    const isExpanded = !expandedDestinations[destination.slug]
    setExpandedDestinations((prevState) => {
      const newState = {
        ...prevState,
        [destination.slug]: isExpanded
      }
      // Calculate new height based on expanded/collapsed destinations
      const newHeight = calculateTotalHeight(newState, selectedCategory)
      animateExpansion(destination.slug, isExpanded, newHeight)
      return newState
    })
  }

  const animateExpansion = (slug: string, isExpanded: boolean, newHeight: number): void => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!animations.current[slug]) {
      animations.current[slug] = new Animated.Value(0)
    }

    Animated.parallel([
      Animated.timing(animations.current[slug], {
        toValue: isExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: false
      }),
      Animated.timing(heightAnim, {
        toValue: newHeight, // Use the new height when animating
        duration: 300,
        useNativeDriver: false
      })
    ]).start()
  }

  const renderDestination = (destination: Destination): React.JSX.Element => {
    const parks = Object.values(destination.parks)
    const isExpanded = expandedDestinations[destination.slug]
    const animation = animations.current[destination.slug] || new Animated.Value(0)
    const height = animation.interpolate({ inputRange: [0, 1], outputRange: [0, parks.length * 50] })

    return (
      <View key={destination.slug} style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <Pressable
          style={[styles.destinationCard, isExpanded ? styles.destinationCardSelected : null]}
          onPress={() => {
            parks.length === 1
              ? navigation.navigate('Park', { park: parks[0], destId: destination.slug })
              : toggleExpand(destination)
          }}
        >
          <Text style={styles.destinationTitle}>{formatParkName(parks.length === 1 ? parks[0].name : destination.name)}</Text>
        </Pressable>
        {parks.length > 1 && (
          <View style={styles.shadowWrapper}>
            <Animated.View style={[styles.expandedParkList, { height }]}>
              {parks.map((park: Park, index: number) => (
                <Pressable
                  key={park.id}
                  style={[styles.parkListCardFirst, index === 0 ? null : styles.parkListCard]}
                  onPress={() => navigation.navigate('Park', { park, destId: destination.slug })}
                >
                  <Text style={styles.parkListCardText}>{formatParkName(park.name)}</Text>
                </Pressable>
              ))}
            </Animated.View>
          </View>
        )}
      </View>
    )
  }

  const showSelectedCategory = (): React.JSX.Element => {
    if (selectedCategory != null) {
      if (selectedCategory === 'Disney') {
        return (<>{disneyDestinations.map(renderDestination)}</>)
      } else if (selectedCategory === 'Universal') {
        return (<>{otherDestinations.map(renderDestination)}</>)
      } else {
        return (<></>)
      }
    } else {
      return (
        <></>
      )
    }
  }

  const { fadeAnim, heightAnim, animate } = useExpandableAnimation()

  const handleCategorySelect = (category: 'Disney' | 'Universal'): void => {
    const newHeight = calculateTotalHeight(expandedDestinations, category)
    if (category === selectedCategory) {
      animate(0, 0)
      setSelectedCategory(null)
    } else {
      animate(1, newHeight)
      setSelectedCategory(category)
    }
  }

  const formatParkName = (name: string): string => {
    return name.replace(/Disney's|Water Park| Park| Theme|Universal's/g, '').replace(/Universal I/, 'I')
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          title={`Last updated: ${new Date(lastUpdated).toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          })}`}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      <View style={styles.main}>
        {/* Welcome Section */}
        <View style={styles.destinationSectionView}>
          <Text style={styles.attrAvailSectionText}>Welcome!</Text>
        </View>

        {/* Destination selection section */}
        {disneyDestinations.length === 0
          ? <View style={{ height: 100, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size='large'/>
              <View style={{ height: 10 }}/>
              <Text style={{ fontSize: 24 }}>Collecting parks...</Text>
            </View>
          : (
            <>
              <View style={styles.destinationSectionView2}>
                <Text style={styles.attrAvailSectionText2}>Tap to find a park:</Text>
              </View>
              {/* Category Selection: Disney or Universal */}
              <View style={{ display: 'flex', flexDirection: 'row', paddingHorizontal: 8, marginTop: 0 }}>
                <Pressable
                  style={[styles.destSelectButton, selectedCategory === 'Disney' ? styles.destSelectButtonSelected : null]}
                  onPress={() => { handleCategorySelect('Disney') }}
                >
                  <Text style={styles.destSelectText}>Disney</Text>
                </Pressable>

                <Pressable
                  style={[styles.destSelectButton, selectedCategory === 'Universal' ? styles.destSelectButtonSelected : null]}
                  onPress={() => { handleCategorySelect('Universal') }}
                >
                  <Text style={styles.destSelectText}>Universal</Text>
                </Pressable>
              </View>

              {/* Render Destinations Based on Selected Category */}
              <Animated.View
                style={{
                  width: '100%',
                  opacity: fadeAnim,
                  height: heightAnim, // Animate the height
                  marginBottom: 20,
                  overflow: 'hidden'
                }}
              >
                {showSelectedCategory()}
              </Animated.View>
            </>
            )}

        {/* Location-based section */}
        <View style={styles.homePageSubSection}>
          <Text style={styles.homePageSubSectionText}>Nearby</Text>
          <View style={styles.homePageSubSectionIcon}>
            {((locationPermission?.granted) === true)
              ? <Ionicons name="navigate" size={24} color={styles.thing.color} />
              : <Ionicons name="navigate-outline" size={24} color="black" />
          }

          </View>
        </View>
        <View style={{ flex: 1, backgroundColor: '#f3f4fb', width: '100%' }}>
          <LocationDataSection navigation={navigation} />
        </View>
      </View>
    </ScrollView>
  )
}

export default DestinationsList
