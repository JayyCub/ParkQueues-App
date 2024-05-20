import { Image, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native'
import { styles } from '../styles'
import React, { useEffect, useState } from 'react'
import { type Park } from '../Data/Park'
import { type Attraction, LiveStatusType } from '../Data/Attraction'
import LiveDataComponent from '../Components/LiveDataComponent'
import { useDataContext } from '../Data/DataContext'

const ParkPage = ({ route, navigation }: any): React.JSX.Element => {
  const { parks, lastUpdated, refreshData, showTrends, toggleShowTrends, sortAlpha, toggleSortAlpha } = useDataContext()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const [park, setPark] = useState<Park>(route.params?.park)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filteredAttractions, setFilteredAttractions] = useState<Attraction[]>([])
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const updatedPark = parks.get(park.id)
    if (updatedPark != null) {
      setPark(updatedPark)
    }
  }, [lastUpdated, parks, park.id])

  const openAttractions = Object.values(park.liveData).filter((attr: { status: LiveStatusType }) =>
    attr.status === LiveStatusType.OPERATING
  )
  const closedAttractions = Object.values(park.liveData).filter((attr: { status: LiveStatusType }) =>
    attr.status !== LiveStatusType.OPERATING
  )

  const sortedOpenAttractions = openAttractions.slice().sort((a, b) => {
    return sortAlpha ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  })

  const sortedClosedAttractions = closedAttractions.slice().sort((a, b) => {
    return sortAlpha ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  })

  const filterAttractions = (query: string): void => {
    const filteredOpenAttractions = openAttractions.filter(attraction =>
      attraction.name.toLowerCase().includes(query.toLowerCase())
    ).slice().sort((a, b) => {
      return sortAlpha ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    })
    const filteredOtherAttractions = closedAttractions.filter(attraction =>
      attraction.name.toLowerCase().includes(query.toLowerCase())
    ).slice().sort((a, b) => {
      return sortAlpha ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    })
    setFilteredAttractions([...filteredOpenAttractions, ...filteredOtherAttractions])
  }

  const handleSearch = (query: string): void => {
    setSearchQuery(query)
    filterAttractions(query)
  }

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
      <View style={styles.subheaderView}>
        <Text style={styles.subheaderText}>@ {park.name}</Text>
      </View>
      <View style={styles.toolsHeaderView}>
        <View style={{ flex: 4 }}>
          <TextInput
            style={searchQuery !== '' ? styles.searchBarSelected : styles.searchBar}
            onChangeText={handleSearch}
            value={searchQuery}
            placeholder="Search"
            returnKeyType="done"
            clearButtonMode="always"
          />
        </View>
        <Pressable onPress={ () => { toggleSortAlpha() } }>
          {!sortAlpha
            ? <View style={styles.subheaderSortAlphaAsc}>
              <Image
                style={{ width: 40, height: 40 }}
                source={require('../icon_imgs/sort-alph-asc.png')}
              />
            </View>
            : <View style={styles.subheaderSortAlphaDesc}>
              <Image
                style={{ width: 40, height: 40 }}
                source={require('../icon_imgs/sort-alph-desc.png')}
              />
            </View>
          }
        </Pressable>
        <Pressable onPress={() => { toggleShowTrends() }}>
          {showTrends
            ? <View style={styles.subheaderShowDataTrue}>
              <Image
                style={{ width: 30, height: 30 }}
                source={require('../icon_imgs/trends-icon.png')}
              />
            </View>
            : <View style={styles.subheaderShowDataFalse}>
              <Image
                style={{ width: 30, height: 30 }}
                source={require('../icon_imgs/trends-icon.png')}
              />
            </View>
          }
        </Pressable>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl title='Pull down to refresh' refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.main}>
          {searchQuery !== ''
            ? filteredAttractions.map((attr: Attraction, index: number) => (
              <Pressable
                key={index}
                style={styles.attractionCard}
                onPress={() => navigation.navigate('Attraction', { attr, timezone: park.timezone })}
              >
                <View style={styles.attractionTitle}>
                  <Text style={styles.attractionTitleText}>{attr.name}</Text>
                </View>
                <LiveDataComponent attr={attr} timezone={park.timezone} showAdditionalText={showTrends} />
              </Pressable>
            ))
            : <>
              {sortedOpenAttractions.map((attr: Attraction, index: number) => (
                <Pressable
                  key={index}
                  style={styles.attractionCard}
                  onPress={() => navigation.navigate('Attraction', { attr, timezone: park.timezone })}
                >
                  <View style={styles.attractionTitle}>
                    <Text style={styles.attractionTitleText}>{attr.name}</Text>
                  </View>
                  <LiveDataComponent attr={attr} timezone={park.timezone} showAdditionalText={showTrends} />
                </Pressable>
              ))}
              <View style={styles.attrAvailSectionView}>
                <Text style={styles.attrAvailSectionText}>Closed Attractions</Text>
              </View>
              {sortedClosedAttractions.map((attr: Attraction, index: number) => (
                <Pressable
                  key={index}
                  style={styles.attractionCard}
                  onPress={() => navigation.navigate('Attraction', { attr, timezone: park.timezone })}
                >
                  <View style={styles.attractionTitle}>
                    <Text style={styles.attractionTitleText}>{attr.name}</Text>
                  </View>
                  <LiveDataComponent attr={attr} timezone={park.timezone} showAdditionalText={showTrends} />
                </Pressable>
              ))}
            </>
          }
        </View>
      </ScrollView>
    </>
  )
}

export default ParkPage
