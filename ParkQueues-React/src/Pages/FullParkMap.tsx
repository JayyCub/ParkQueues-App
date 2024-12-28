import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDataContext } from '../Data/DataContext'
import type { Park } from '../Data/Park'
import Header from '../Components/Rendered/CustomStatusBar'
import { Platform, Pressable, ScrollView, Text, TextInput, View, Animated, LayoutAnimation, Switch } from 'react-native'
import { colorPalette, fontFamily, platformStyle, styles } from '../styles'
import MapView from 'react-native-map-clustering'
import { Marker, type Region } from 'react-native-maps'
import type * as Location from 'expo-location'
import { type Attraction } from '../Data/Attraction'
import AttractionMapMarker from '../Components/Rendered/AttractionMapMarker'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import AttractionCard from '../Components/Rendered/AttractionCard'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Provider as PaperProvider } from 'react-native-paper'

export const FullParkMap = ({ route, navigation }: any): React.JSX.Element => {
  const { parks, lastUpdated, refreshData, userData, location, closestAttractions } = useDataContext()
  const [park, setPark] = useState<Park>(route.params?.park)

  const [bottomSheetIndex, setBottomSheetIndex] = useState(0) // Add state to track bottom sheet index

  const handleSheetChanges = useCallback((index: number) => {
    // console.log('handleSheetChanges', index)
    setBottomSheetIndex(index) // Update the state when the bottom sheet changes
  }, [])

  const [trendFilter, setTrendFilter] = useState<boolean>(false)

  const [searchQuery, setSearchQuery] = useState<string>('')

  const favAttrs: string[] = []
  userData?.favs.forEach(attr => favAttrs.push(attr.id))

  navigation.setOptions({
    headerTitle: () => <Header platform={Platform.OS} title={park.name.replace(/Disney's | Water| Park| Theme/g, '')} />,
    headerTitleAlign: 'center',
    headerStyle: {
      backgroundColor: platformStyle.statusBar.bgColor
    },
    headerShadowVisible: false,
    presentation: 'card'
  })

  // Helper function to calculate the distance between two points
  const calculateDistance = (location1: Location.LocationObject, location2: { lat: number, lon: number }): number => {
    const EARTH_RADIUS_KM = 6371 // Earth's radius in kilometers
    const toRadians = (degrees: number): number => degrees * (Math.PI / 180)

    const lat1 = location1.coords.latitude
    const lon1 = location1.coords.longitude
    const lat2 = location2.lat
    const lon2 = location2.lon

    const dLat = toRadians(lat2 - lat1)
    const dLon = toRadians(lon2 - lon1)

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distanceInKm = EARTH_RADIUS_KM * c

    return distanceInKm * 0.621371 // Convert to miles
  }

  // Memoize initialRegion to avoid recalculation on every render
  const initialRegion: Region = useMemo(() => {
    const determineInitialRegion = (): Region => {
      if (park.lat == null || park.lon == null) {
        throw new Error('Park location is missing.')
      }

      const userLocationAvailable =
        location?.coords.latitude != null && location?.coords.longitude != null
      const userIsInPark =
        closestAttractions[0]?.park?.id === park.id &&
        calculateDistance(location!, { lat: park.lat, lon: park.lon }) < 0.5

      if (userLocationAvailable && userIsInPark) {
        // console.log('User is in closest park, using user location')
        return {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0025,
          longitudeDelta: 0.0025
        }
      }

      // console.log('Not using user location')
      return {
        latitude: park.lat,
        longitude: park.lon,
        latitudeDelta: 0.0075,
        longitudeDelta: 0.0075
      }
    }

    try {
      return determineInitialRegion()
    } catch (error) {
      console.error(error.message)
      return {
        latitude: park.lat,
        longitude: park.lon,
        latitudeDelta: 0.0075,
        longitudeDelta: 0.0075
      }
    }
  }, [location, closestAttractions, park])

  const mapRef = useRef<MapView | null>(null)
  const [filteredAttractions, setFilteredAttractions] = useState<Attraction[]>([])

  useEffect(() => {
    filterAttractionsByRegion(initialRegion)
  }, [initialRegion])

  const filterAttractionsByRegion = useCallback((region: Region): void => {
    const filtered = Object.values(park.liveData).filter(attr => {
      const isInRegion =
        attr.lat >= region.latitude - region.latitudeDelta / 2 &&
        attr.lat <= region.latitude + region.latitudeDelta / 2 &&
        attr.lon >= region.longitude - region.longitudeDelta / 2 &&
        attr.lon <= region.longitude + region.longitudeDelta / 2

      return isInRegion && attr.name.toLowerCase().includes(searchQuery.toLowerCase())
    }).sort((a, b) => a.name.localeCompare(b.name))

    setFilteredAttractions(filtered)
  }, [park.liveData, searchQuery])

  const renderAttractionList = (): any =>
    filteredAttractions.map((attr, index) => (
      <AttractionCard
        key={index}
        attr={attr}
        timezone={park.timezone}
        showAdditionalText={true}
        navigation={navigation}
        favorite={favAttrs.includes(attr.id)}
        destId={route.params.destId}
        parkId={park.id}
        navStack='Attraction'
        hideFav={true}
      />
    ))

  const snapPoints = useMemo(() => ['11%', '50%'], [])
  const bottomSheetRef = useRef<BottomSheet>(null)

  const renderCustomCluster = (cluster: any): React.JSX.Element => {
    const { id, geometry, properties } = cluster
    const [longitude, latitude] = geometry.coordinates
    const pointCount = properties.point_count

    return (
      <Marker
        key={`cluster-${id}`}
        coordinate={{ latitude, longitude }}
        onPress={() => mapRef.current?.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: initialRegion.latitudeDelta / 5,
          longitudeDelta: initialRegion.longitudeDelta / 5
        })} >
        <View
          style={{
            backgroundColor: 'rgba(132,71,255,0.7)', // Cluster background color
            borderRadius: 25, // Makes the cluster circular
            width: 25, // Size of the cluster marker
            height: 25, // Size of the cluster marker
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1.5,
            borderColor: '#fff' // Optional: Border around the cluster
          }}
        >
          <Text
            style={{
              color: '#fff', // Text color
              fontSize: 16,
              fontWeight: 'bold',
              fontStyle: 'italic',
              fontFamily
            }}
          >
            {pointCount}
          </Text>
        </View>
      </Marker>
    )
  }

  const mapComponent = (): React.JSX.Element => {
    return (
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        region={initialRegion}
        mapType="satellite"
        radius={20}
        onRegionChangeComplete={filterAttractionsByRegion} // Re-filter attractions on region change
        renderCluster={renderCustomCluster} // Use the custom cluster rendering function
        animationEnabled={false}
        showsUserLocation={true}
        cameraZoomRange={{ minCenterCoordinateDistance: 200, maxCenterCoordinateDistance: 2200, animated: true }}
      >
        {filteredAttractions.map((attr: Attraction, index: number) => (
          <Marker
            key={index}
            coordinate={{ latitude: attr.lat ?? 0, longitude: attr.lon ?? 0 }}
          >
            <AttractionMapMarker
              attr={attr}
              showAdditionalText={trendFilter}
              isSelected={selectedAttraction?.id === attr.id}
              onPress={handleMarkerPress}
            />
          </Marker>
        ))}
      </MapView>
    )
  }

  const filterAttractions = (query: string): void => {
    const filtered = Object.values(park.liveData).filter((attr: Attraction) =>
      attr.name.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredAttractions(filtered)
  }

  const handleSearch = (query: string): void => {
    setSearchQuery(query)
    filterAttractions(query)
  }

  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null)

  const [cardAnimation] = useState(new Animated.Value(0))

  const handleMarkerPress = (attraction: Attraction): void => {
    cardAnimation.setValue(0)

    setSelectedAttraction(attraction)
    bottomSheetRef.current?.close()

    Animated.spring(cardAnimation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7
    }).start()
  }

  const renderSelectedAttractionCard = (): React.JSX.Element | null => {
    if (!selectedAttraction) return null

    return (
      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: 10,
            width: '100%',
            alignItems: 'center',
            transform: [{
              translateY: cardAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              })
            }],
            opacity: cardAnimation
          }
        ]}
      >
        <AttractionCard
          key={9999}
          attr={selectedAttraction}
          timezone={park.timezone}
          showAdditionalText={true}
          navigation={navigation}
          favorite={favAttrs.includes(selectedAttraction.id)}
          destId={route.params.destId}
          parkId={park.id}
          navStack='Attraction'
          hideFav={true}
        />
        <Ionicons
          name='close-circle'
          size={24}
          color='gray'
          onPress={(): void => {
            Animated.timing(cardAnimation, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true
            }).start(() => {
              bottomSheetRef.current?.snapToIndex(0)
              setSelectedAttraction(null)
            })
          }}
          style={{ position: 'absolute', top: 14, right: 15 }}
        />
      </Animated.View>
    )
  }

  const [filterMenuVisible, setFilterMenuVisible] = useState(false)

  const renderFilterDropdown = (): React.JSX.Element => {
    const toggleFilterMenu = (): void => {
      LayoutAnimation.configureNext({
        duration: 200, // Animation duration in ms
        create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
        update: { type: LayoutAnimation.Types.spring, springDamping: 0.7 },
        delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity }
      })
      setFilterMenuVisible(!filterMenuVisible)
    }

    return (
      <>
      <View style={{
        position: 'absolute',
        top: 10,
        right: 10,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: 'white',
        alignItems: 'flex-end'
        // minWidth: 120
      }}>
        {/* Main button */}
        <Pressable
          style={{
            flexDirection: 'row',
            padding: 5,
            // width: '100%',
            justifyContent: 'flex-end'
          }}
          onPress={toggleFilterMenu}
        >
          <Ionicons
            name='filter'
            size={26}
            color='black'
          />
        </Pressable>
      </View>
      {/* Dropdown menu */}
      {filterMenuVisible && (
        <View style={{
          position: 'absolute',
          top: 55,
          right: 10,
          borderRadius: 10,
          overflow: 'hidden',
          backgroundColor: 'white',
          padding: 10,
          minWidth: 150
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Text style={{
              fontFamily,
              marginRight: 10,
              fontSize: 18
            }}>
              5-min. changes
            </Text>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={trendFilter ? '#1520ed' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => { setTrendFilter(!trendFilter) }}
              value={trendFilter}
            />
          </View>
        </View>
      )}
      </>
    )
  }

  return (
    <PaperProvider>
      <View style={{ flex: 1 }}>
        {/* Search bar section */}
        <View style={{ width: '100%' }}>
          <View style={styles.toolsHeaderView}>
            <View style={{ flex: 4 }}>
              <TextInput
                style={styles.searchBarSelected}
                onChangeText={handleSearch}
                value={searchQuery}
                placeholder="Search for an attraction"
                returnKeyType="done"
                clearButtonMode="always"
              />
            </View>
          </View>
        </View>

        {/* MapView with BottomSheet */}
        <View style={{ flex: 1 }}>
          <GestureHandlerRootView style={styles.gestureHandler}>
            {mapComponent()}
            {renderFilterDropdown()}
            {renderSelectedAttractionCard()}
            <BottomSheet
              style={{ marginTop: 20 }}
              snapPoints={snapPoints}
              ref={bottomSheetRef}
              onChange={handleSheetChanges}
              // handleStyle={{ backgroundColor: 'gray' }}
              backgroundStyle={{ backgroundColor: colorPalette.layer15 }}
            >
              <BottomSheetView style={styles.bottomSheetContent}>
                <Text style={{ fontSize: 16, fontFamily, fontStyle: 'italic' }}>{filteredAttractions.length} Attractions</Text>
                <View style={styles.bottomSheetMain}>
                  <ScrollView
                    style={{ marginTop: 15 }}
                    contentContainerStyle={{
                      alignItems: 'center',
                      paddingVertical: 0,
                      paddingBottom: 500 // Add padding when half-expanded
                    }}
                  >
                    {filteredAttractions.length > 0 ? renderAttractionList() : <Text>No attractions in the visible region.</Text>}
                  </ScrollView>
                </View>
              </BottomSheetView>
            </BottomSheet>
          </GestureHandlerRootView>
        </View>
      </View>
    </PaperProvider>
  )
}
