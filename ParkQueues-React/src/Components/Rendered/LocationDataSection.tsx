import React from 'react'
import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import { PermissionStatus } from 'expo-location'
import OpenSettingsButton from './OpenSettingsButton' // Assuming you have this component
import { type AttractionWithDistance, useDataContext } from '../../Data/DataContext'
import { styles } from '../../styles'
import CustomCarousel from './Carousel'
import { ImageCarouselItem } from '../Data/ImageCarouselItem'
import AttractionCard from './AttractionCard' // Assuming you have your styles imported

export const LocationDataSection = ({ navigation }: any): React.JSX.Element => {
  const { locLastUpdated, locationProcessingComplete, locationPermission, closestAttractions, getLocationData, userData } = useDataContext()
  const numAttrs = 5
  const favAttrs: string[] = []
  userData?.favs.forEach(attr => favAttrs.push(attr.id))

  // Carousel for closest attractions
  const renderCarouselItem = (item: AttractionWithDistance): React.JSX.Element => {
    const distanceInFeet = item.distance * 3280.84 // Convert distance from km to feet
    const distanceInMiles = item.distance * 0.621371 // Convert distance from km to miles

    return (
      <View>
        <View style={styles.nearbyAttrDest}>
          <Text style={styles.favAttrParkText}>
            {distanceInFeet <= 500
              ? `${Math.round(distanceInFeet)} feet away`
              : `${distanceInMiles.toFixed(1)} miles away`}
          </Text>
        </View>
        <AttractionCard
          attr={item.attraction}
          timezone={item.park.timezone}
          showAdditionalText={true}
          navigation={navigation}
          favorite={favAttrs.includes(item.attraction.id)}
          destId={item.destination.id}
          parkId={item.park.id}
          navStack={'Attraction'}
          hideFav={true}
        />
      </View>
    )
  }

  if (locationPermission != null) {
    if (locationPermission.granted && locationPermission.status === PermissionStatus.GRANTED) {
      if (locationProcessingComplete && closestAttractions[0] != null) {
        return (
          <View>
            <View style={{ alignItems: 'center', marginVertical: 5 }}>
              <Text style={{
                width: '88%',
                color: '#585858',
                fontSize: 12,
                textAlign: 'right'
              }}>{`Location updated: ${new Date(locLastUpdated).toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
              })}`}</Text>
              <Pressable
                key={closestAttractions[0].destination.slug}
                style={styles.closestDestinationCard}
                onPress={() => navigation.navigate('Park', {
                  park: closestAttractions[0].park,
                  destId: closestAttractions[0].destination.slug
                })}
              >
                <View>
                  <Text style={styles.parkListCardText}>
                    {closestAttractions[0].park.name}
                  </Text>
                </View>
              </Pressable>
            </View>
            <View style={styles.homePageSubSubSection}>
              <View style={styles.homePageSubSubSectionHeader}>
                <Text style={styles.homePageSubSubSectionText}>{numAttrs} nearest attractions</Text>
              </View>
            </View>
            <CustomCarousel
              data={closestAttractions.slice(0, numAttrs).map(item => new ImageCarouselItem(item.attraction.id, 'test?', renderCarouselItem(item)))}
            />
          </View>
        )
      } else {
        return (
          <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size='large' />
            <View style={{ height: 30 }} />
            <Text style={{ fontSize: 24 }}>Getting location data...</Text>
          </View>
        )
      }
    } else {
      return (
        <View style={{ alignItems: 'center', width: '100%' }}>
          <View style={styles.destinationSectionView2}>
            <Text style={[styles.attrAvailSectionText2, { marginTop: 0, marginBottom: 20 }]}>
              You have not granted ParkQueues permission to use your current location. Tap to update your settings.
            </Text>
          </View>
          <OpenSettingsButton getLocationData={getLocationData} />
        </View>
      )
    }
  } else {
    return <Text>Location permission is null</Text>
  }
}
