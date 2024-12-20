import React, { useEffect, useState } from 'react'
import { Platform, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native'
import { platformStyle, styles } from '../styles'
import { type Park } from '../Data/Park'
import { type Attraction, LiveStatusType } from '../Data/Attraction'
import { useDataContext } from '../Data/DataContext'
import AttractionCard from '../Components/Rendered/AttractionCard'
import Header from '../Components/Rendered/CustomStatusBar'
import { FontAwesome5, Ionicons } from '@expo/vector-icons'

const AttractionsList = ({ route, navigation }: any): React.JSX.Element => {
  const { parks, lastUpdated, refreshData, showTrends, toggleShowTrends, sortAlpha, toggleSortAlpha, userData } = useDataContext()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const [park, setPark] = useState<Park>(route.params?.park)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filteredAttractions, setFilteredAttractions] = useState<Attraction[]>([])
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
              <FontAwesome5 name="sort-alpha-up" size={24} color="white" />
            </View>
            : <View style={styles.subheaderSortAlphaDesc}>
              <FontAwesome5 name="sort-alpha-down" size={24} color="white" />
            </View>
          }
        </Pressable>
        <Pressable onPress={() => { toggleShowTrends() }}>
          {showTrends
            ? <View style={styles.subheaderShowDataTrue}>
              <Ionicons name={'trending-up'} size={30} color={'white'}/>
            </View>
            : <View style={styles.subheaderShowDataFalse}>
              <Ionicons name={'trending-up'} size={30} color={'white'}/>
            </View>
          }
        </Pressable>
      </View>
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
          {searchQuery !== ''
            ? filteredAttractions.map((attr: Attraction, index: number) => (
              <AttractionCard
                key={index}
                attr={attr}
                timezone={park.timezone}
                showAdditionalText={showTrends}
                navigation={navigation}
                favorite={favAttrs.includes(attr.id)}
                parkId={park.id}
                destId={route.params.destId}
                navStack='Attraction'
              />
            ))
            : <>
              {sortedOpenAttractions.map((attr: Attraction, index: number) => (
                <AttractionCard
                  key={index}
                  attr={attr}
                  timezone={park.timezone}
                  showAdditionalText={showTrends}
                  navigation={navigation}
                  favorite={favAttrs.includes(attr.id)}
                  parkId={park.id}
                  destId={route.params.destId}
                  navStack='Attraction'
                />
              ))}
              <View style={styles.attrAvailSectionView}>
                <Text style={styles.attrAvailSectionText}>Closed Attractions</Text>
              </View>
              {sortedClosedAttractions.map((attr: Attraction, index: number) => (
                <AttractionCard
                  key={index}
                  attr={attr}
                  timezone={park.timezone}
                  showAdditionalText={showTrends}
                  navigation={navigation}
                  favorite={favAttrs.includes(attr.id)}
                  parkId={park.id}
                  destId={route.params.destId}
                  navStack='Attraction'
                />
              ))}
            </>
          }
        </View>
      </ScrollView>
    </>
  )
}

export default AttractionsList
