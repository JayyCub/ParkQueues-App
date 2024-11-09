import React, { useState } from 'react'
import { ActivityIndicator, LayoutAnimation, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native'
import { styles } from '../styles'
import { useDataContext } from '../Data/DataContext'
import { type Destination } from '../Data/Destination'
import { type Park } from '../Data/Park'
import Ionicons from '@expo/vector-icons/Ionicons'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { LocationDataSection } from '../Components/Rendered/LocationDataSection'

const DestinationsList = ({ route, navigation }: any): React.JSX.Element => {
  const { destinations, locationPermission, lastUpdated, refreshData, getLocationData } = useDataContext()
  const [refreshing, setRefreshing] = useState(false)
  const [expandedDestinations, setExpandedDestinations] = useState<Record<string, boolean>>({})
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

  const onRefresh = (): void => {
    setRefreshing(true)
    refreshData().then(() => {
      setRefreshing(false)
    })
  }

  const customLayoutAnimation = {
    duration: 400, // Duration in milliseconds
    create: {
      type: LayoutAnimation.Types.easeInEaseOut, // Type of animation for creating elements
      property: LayoutAnimation.Properties.opacity // Property to animate (e.g., opacity, scaleXY)
    },
    update: {
      type: LayoutAnimation.Types.spring, // Type of animation for updates
      springDamping: 0.85 // Controls the spring effect, higher value = less spring
    },
    delete: {
      type: LayoutAnimation.Types.easeInEaseOut, // Type of animation for deleting elements
      property: LayoutAnimation.Properties.scaleXY // Property to animate (e.g., scaleXY for zoom-out effect)
    }
  }

  const toggleExpand = (destination: Destination): void => {
    LayoutAnimation.configureNext(customLayoutAnimation)
    setExpandedDestinations(prevState => ({
      ...prevState,
      [destination.slug]: !prevState[destination.slug]
    }))
  }

  const handleCategorySelect = (category: 'Disney' | 'Universal'): void => {
    LayoutAnimation.configureNext(customLayoutAnimation)

    // If changing or deselecting the category, reset expandedDestinations
    setSelectedCategory(prev => {
      const isSameCategory = prev === category
      setExpandedDestinations({}) // Clear expanded destinations

      // Toggle category selection
      return isSameCategory ? null : category
    })
  }

  const renderDestination = (destination: Destination): React.JSX.Element => {
    const parks = Object.values(destination.parks)
    const isExpanded = expandedDestinations[destination.slug]

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
        {isExpanded && parks.length > 1 && (
          <View style={styles.shadowWrapper}>
            <View style={styles.expandedParkList}>
              {parks.map((park: Park, index: number) => (
                <Pressable
                  key={park.id}
                  style={[styles.parkListCardFirst, index === 0 ? null : styles.parkListCard]}
                  onPress={() => navigation.navigate('Park', { park, destId: destination.slug })}
                >
                  <Text style={styles.parkListCardText}>{formatParkName(park.name)}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </View>
    )
  }

  const showSelectedCategory = (): React.JSX.Element => {
    if (selectedCategory === 'Disney') {
      return (<>{disneyDestinations.map(renderDestination)}</>)
    } else if (selectedCategory === 'Universal') {
      return (<>{otherDestinations.map(renderDestination)}</>)
    }
    return <></>
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

              <View style={styles.destinationsBox}>
                {showSelectedCategory()}
              </View>
            </>
            )}

        {/* Location-based section */}
        <View style={styles.homePageSubSection}>
          <Text style={styles.homePageSubSectionText}>Nearby</Text>
          <View style={styles.homePageSubSectionIcon}>
            {((locationPermission?.granted) === true)
              ? <>
                <FontAwesome name="refresh" size={24} color={styles.homePageSubSectionText.color} onPress={getLocationData}/>
                <View style={{ width: 15 }}></View>
                <Ionicons name="navigate" size={24} color={styles.homePageSubSectionText.color} />
              </>
              : <Ionicons name="navigate-outline" size={24} color="black" />
            }
          </View>
        </View>
        <View style={{ flex: 1, width: '100%' }}>
          <LocationDataSection navigation={navigation} />
        </View>
      </View>
    </ScrollView>
  )
}

export default DestinationsList
