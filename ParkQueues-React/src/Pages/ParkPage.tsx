import React, { useEffect, useState } from 'react'
import { Button, Platform, RefreshControl, ScrollView, View } from 'react-native'
import { platformStyle, styles } from '../styles'
import { type Park } from '../Data/Park'
import { useDataContext } from '../Data/DataContext'
import Header from '../Components/CustomStatusBar'
import Mapbox from '@rnmapbox/maps'

Mapbox.setAccessToken('<YOUR_ACCESSTOKEN>').then(() => {}).catch(e => { console.error(e) })

const ParkPage = ({ route, navigation }: any): React.JSX.Element => {
  const { parks, lastUpdated, refreshData, userData } = useDataContext()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const [park, setPark] = useState<Park>(route.params?.park)
  const [refreshing, setRefreshing] = useState(false)

  const favAttrs: string[] = []
  userData?.favs.forEach(attr => favAttrs.push(attr.id))

  useEffect(() => {
    const updatedPark = parks.get(park.id)
    if (updatedPark != null) {
      setPark(updatedPark)
    }

    navigation.setOptions({
      headerTitle: () => <Header platform={Platform.OS} title={park.name.replace(/Disney's | Water| Park| Theme/g, '')} />,
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: platformStyle.statusBar.bgColor
      },
      headerShadowVisible: false,
      presentation: 'card'
    })
  }, [lastUpdated, parks, park.id])

  const onRefresh = (): void => {
    setRefreshing(true)
    // eslint-disable-next-line
    refreshData().then(() => {
      // Set refreshing state to false to hide the spinner
      setRefreshing(false)
    })
  }

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl
            title={`Last updated: ${new Date(lastUpdated).toLocaleString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              // second: 'numeric',
              hour12: true
              // timeZone: park.timezone
            })}`}
            refreshing={refreshing} onRefresh={onRefresh}
          />
        }>
        <View style={styles.main}>
          <Button
            title="View All Attractions"
            onPress={() => navigation.navigate('AttractionsList', { park, destId: route.params?.destId })}
          />
          <Mapbox.MapView style={{ flex: 1 }} />
        </View>
      </ScrollView>
    </>
  )
}

export default ParkPage
