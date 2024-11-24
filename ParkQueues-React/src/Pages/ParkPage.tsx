import React, { useEffect, useState } from 'react'
import { Platform, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native'
import { platformStyle, styles } from '../styles'
import { type Park } from '../Data/Park'
import { useDataContext } from '../Data/DataContext'
import Header from '../Components/Rendered/CustomStatusBar'
import type { Attraction } from '../Data/Attraction'
import AttractionCard from '../Components/Rendered/AttractionCard'
import { ImageCarouselItem } from '../Components/Data/ImageCarouselItem'
import CustomCarousel from '../Components/Rendered/Carousel'
import { ReturnTimeState } from '../Data/Queue'

const ParkPage = ({ route, navigation }: any): React.JSX.Element => {
  const { parks, lastUpdated, refreshData, userData } = useDataContext()
  const [park, setPark] = useState<Park>(route.params?.park)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [refreshing, setRefreshing] = useState(false)
  const [attrSearchResults, setAttrSearchResults] = useState<Attraction[]>([])
  const [soonestAvailable, setSoonestAvailable] = useState<Attraction[]>([])
  const [lastReservations, setLastReservations] = useState<Attraction[]>([])
  const [longestWaits, setLongestWaits] = useState<Attraction[]>([])
  const [attractionsWithDiff, setAttractionsWithDiff] = useState<Attraction[]>([])

  const favAttrs: string[] = []
  userData?.favs.forEach(attr => favAttrs.push(attr.id))

  useEffect(() => {
    const updatedPark = parks.get(park.id)
    if (updatedPark != null) {
      setPark(updatedPark)
    }

    // Update header
    navigation.setOptions({
      headerTitle: () => <Header platform={Platform.OS} title={park.name.replace(/Disney's | Water| Park| Theme/g, '')} />,
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: platformStyle.statusBar.bgColor
      },
      headerShadowVisible: false,
      presentation: 'card'
    })

    const now = new Date()
    const minsInTheFuture = 30

    // Filter attractions by soonest available return time
    const nearbyAvailable = Object.values(park.liveData)
      .filter(attraction => {
        const returnTime = attraction.queue.RETURN_TIME
        const paidReturnTime = attraction.queue.PAID_RETURN_TIME

        const isAvailable = (timeObj) => (
          timeObj != null &&
          timeObj.state === ReturnTimeState.AVAILABLE &&
          new Date(timeObj.returnStart) <= new Date(now.getTime() + minsInTheFuture * (1000 * 60))
        )

        return isAvailable(returnTime) || isAvailable(paidReturnTime)
      })
      .sort((a, b) => {
        // Get earliest available return time for each attraction
        const getEarliestTime = (attr: Attraction): number => {
          const returnTime = attr.queue.RETURN_TIME
          const paidReturnTime = attr.queue.PAID_RETURN_TIME

          const times = [
            returnTime && returnTime.state === ReturnTimeState.AVAILABLE ? new Date(returnTime.returnStart) : null,
            paidReturnTime && paidReturnTime.state === ReturnTimeState.AVAILABLE ? new Date(paidReturnTime.returnStart) : null
          ].filter(Boolean)

          return times.length > 0 ? Math.min(...times.map(time => time.getTime())) : Infinity
        }

        return getEarliestTime(a) - getEarliestTime(b)
      })

    setSoonestAvailable(nearbyAvailable)

    // Filter attractions for latest available reservation times
    const latestAvailable = Object.values(park.liveData)
      .filter(attraction => {
        const returnTime = attraction.queue.RETURN_TIME
        const paidReturnTime = attraction.queue.PAID_RETURN_TIME

        const isAvailable = (timeObj) => (
          timeObj != null &&
          timeObj.state === ReturnTimeState.AVAILABLE
        )

        return isAvailable(returnTime) || isAvailable(paidReturnTime)
      })
      .sort((a, b) => {
        // Get latest available return time for each attraction
        const getLatestTime = (attr: Attraction): number => {
          const returnTime = attr.queue.RETURN_TIME
          const paidReturnTime = attr.queue.PAID_RETURN_TIME

          const times = [
            returnTime && returnTime.state === ReturnTimeState.AVAILABLE ? new Date(returnTime.returnStart) : null,
            paidReturnTime && paidReturnTime.state === ReturnTimeState.AVAILABLE ? new Date(paidReturnTime.returnStart) : null
          ].filter(Boolean)

          return times.length > 0 ? Math.max(...times.map(time => time.getTime())) : -Infinity
        }

        return getLatestTime(b) - getLatestTime(a)
      })
      .slice(0, 5) // Get the top 5 attractions with the latest reservation times

    setLastReservations(latestAvailable)

    // Filter attractions by longest standby wait times
    const longestWaitTimes = Object.values(park.liveData)
      .filter(attraction => attraction.queue.STANDBY?.waitTime != null) // Only include attractions with a standby wait time
      .sort((a, b) => b.queue.STANDBY!.waitTime - a.queue.STANDBY!.waitTime)
      .slice(0, 5) // Get the top 5 attractions with the longest standby wait times

    setLongestWaits(longestWaitTimes)

    const getWaitTimeDiff = (currentWait, previousWait) => {
      if (currentWait !== undefined && previousWait !== undefined) {
        const diff = currentWait - previousWait
        if (diff !== 0) {
          return { diff, icon: diff > 0 ? 'up' : 'down' } // or use `upArrow` / `downArrow` as in your component
        }
      }
      return { diff: 0, icon: null }
    }

    // Filter attractions with non-zero wait time difference
    const attractionsWithNonZeroDiff = Object.values(park.liveData).filter(attr => {
      const prevWait = attr.history[attr.history.length - 2]?.queue?.STANDBY?.waitTime
      const currWait = attr.queue.STANDBY?.waitTime
      const { diff } = getWaitTimeDiff(currWait, prevWait)
      return diff !== 0
    })

    setAttractionsWithDiff(attractionsWithNonZeroDiff)
  }, [lastUpdated, parks, park.id])

  const filterAttractions = (query: string): void => {
    const results = Object.values(park.liveData).filter(attraction =>
      attraction.name.toLowerCase().includes(query.toLowerCase())
    ).sort((a, b) => a.name.localeCompare(b.name))
    setAttrSearchResults(results)
  }

  const handleSearch = (query: string): void => {
    setSearchQuery(query)
    filterAttractions(query)
  }

  const onRefresh = (): void => {
    setRefreshing(true)
    refreshData().then(() => { setRefreshing(false) })
  }

  const renderCarouselItem = (item: Attraction, showDiff: boolean = false): React.JSX.Element => (
    <View>
      <AttractionCard
        attr={item}
        timezone={park.timezone}
        showAdditionalText={showDiff}
        navigation={navigation}
        favorite={favAttrs.includes(item.id)}
        destId={route.params.destId}
        parkId={park.id}
        navStack='Attraction'
        hideFav={true}
      />
    </View>
  )

  return (
    <>
      <View style={styles.toolsHeaderView}>
        <View style={{ flex: 4 }}>
          <TextInput
            style={searchQuery !== '' ? styles.searchBarSelected : styles.searchBar}
            onChangeText={handleSearch}
            value={searchQuery}
            placeholder="Search for an attraction"
            returnKeyType="done"
            clearButtonMode="always"
          />
        </View>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl
            title={`Last updated: ${new Date(lastUpdated).toLocaleString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            })}`}
            refreshing={refreshing} onRefresh={onRefresh}
          />
        }>
        <View style={styles.main}>
          {searchQuery !== ''
            ? <>
              {attrSearchResults.map((attr: Attraction, index: number) => (
                <AttractionCard
                  key={index}
                  attr={attr}
                  timezone={park.timezone}
                  showAdditionalText={false}
                  navigation={navigation}
                  favorite={favAttrs.includes(attr.id)}
                  parkId={park.id}
                  destId={route.params.destId}
                  navStack='Attraction'
                />
              ))}
              <Pressable
                onPress={() => { setSearchQuery('') }}
                style={[styles.closestDestinationCard, { width: '50%', borderWidth: 0, marginTop: 50 }]}>
                <View>
                  <Text style={styles.parkListCardText}>
                    Exit Search
                  </Text>
                </View>
              </Pressable>
            </>
            : (<>
              <View style={styles.homePageSubSection}>
                <Text style={styles.homePageSubSectionText}>Attractions</Text>
              </View>
              <Pressable
                onPress={() => navigation.navigate('AttractionsList', { park: route.params.park, destId: route.params.destId })}
                style={[styles.closestDestinationCard, { borderWidth: 0, marginTop: 12, marginBottom: 10 }]}>
                <Text style={[styles.parkListCardText, { fontWeight: '600' }]}>
                  View all attractions
                </Text>
              </Pressable>

              {longestWaits.length > 0 || attractionsWithDiff.length > 0
                ? (<>
                  <View style={styles.carouselSubtextBox}>
                    <Text style={styles.carouselSubtext}>Longest wait times:</Text>
                  </View>
                  {longestWaits.length > 0
                    ? (<>
                      <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
                        <CustomCarousel
                          data={Object.values(longestWaits).map(item => new ImageCarouselItem(item.id, 'test?', renderCarouselItem(item)))}
                        />
                      </View>
                    </>)
                    : (
                      <View style={{ height: 50, justifyContent: 'center' }}>
                        <Text style={styles.carouselSubtext}>No information available</Text>
                      </View>
                      )}
                  <View style={styles.carouselSubtextBox}>
                    <Text style={styles.carouselSubtext}>Waits changed in last 5 mins:</Text>
                  </View>
                  {attractionsWithDiff.length > 0
                    ? (<>
                      <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
                        <CustomCarousel
                          data={Object.values(attractionsWithDiff).map(item => new ImageCarouselItem(item.id, 'test?', renderCarouselItem(item, true)))}
                        />
                      </View>
                    </>)
                    : (
                      <View style={{ height: 50, justifyContent: 'center' }}>
                        <Text style={styles.carouselSubtext}>No change</Text>
                      </View>
                      )}
                </>)
                : (
                  <View style={styles.carouselSubtextBox}>
                    <Text style={styles.carouselSubtext}>No information available at this time</Text>
                  </View>
                  )}
              <View style={styles.homePageSubSection}>
                <Text style={styles.homePageSubSectionText}>Reservations</Text>
              </View>
              {soonestAvailable.length > 0 || lastReservations.length > 0
                ? (<>
                  {soonestAvailable.length > 0
                    ? (<>
                      <View style={styles.carouselSubtextBox}>
                        <Text style={styles.carouselSubtext}>In the next 30 minutes:</Text>
                      </View>
                      <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
                        <CustomCarousel
                          data={Object.values(soonestAvailable).map(item => new ImageCarouselItem(item.id, 'test?', renderCarouselItem(item)))}
                        />
                      </View>
                      {/* <View style={styles.parkPageDivider}></View> */}
                    </>)
                    : null}
                  {lastReservations.length > 0
                    ? (<>
                      <View style={styles.carouselSubtextBox}>
                        <Text style={styles.carouselSubtext}>In high demand:</Text>
                      </View>
                      <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
                        <CustomCarousel
                          data={Object.values(lastReservations).map(item => new ImageCarouselItem(item.id, 'test?', renderCarouselItem(item)))}
                        />
                      </View>
                    </>)
                    : null}
                  </>)
                : (
                  <View style={styles.carouselSubtextBox}>
                    <Text style={styles.carouselSubtext}>No information available at this time</Text>
                  </View>
                  )
              }
            </>)
          }
        </View>
      </ScrollView>
    </>
  )
}

export default ParkPage
