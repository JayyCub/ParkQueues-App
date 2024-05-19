import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { styles } from '../styles'
import React, { useEffect, useState } from 'react'
import { type Park } from '../Data/Park'
import { type Attraction, LiveStatusType } from '../Data/Attraction'
import LiveDataComponent from '../Components/LiveDataComponent'
import { useDataContext } from '../Data/DataContext'

const ParkPage = ({ route, navigation }: any): React.JSX.Element => {
  const { parks } = useDataContext()
  useEffect(() => {
  }, [parks])

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const [park] = useState<Park>(route.params?.park)
  const [showAdditionalText, setShowAdditionalText] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filteredAttractions, setFilteredAttractions] = useState<Attraction[]>([])
  const [sortAsc, setSortAsc] = useState<boolean>(true) // State for sorting ascending or descending

  // Filter attractions by status
  const openAttractions = Object.values(park.liveData).filter((attr: { status: LiveStatusType }) =>
    attr.status === LiveStatusType.OPERATING)
  const closedAttractions = Object.values(park.liveData).filter((attr: { status: LiveStatusType }) =>
    attr.status !== LiveStatusType.OPERATING)

  // DEFAULT: Sort attractions alphabetically by name
  const sortedOpenAttractions = openAttractions.slice().sort((a, b) => {
    if (sortAsc) {
      return a.name.localeCompare(b.name)
    } else {
      return b.name.localeCompare(a.name)
    }
  })

  const sortedClosedAttractions = closedAttractions.slice().sort((a, b) => {
    if (sortAsc) {
      return a.name.localeCompare(b.name)
    } else {
      return b.name.localeCompare(a.name)
    }
  })

  // const [setRefreshing] = React.useState(false)

  // const onRefresh = React.useCallback(async () => {
  //   setRefreshing(true)
  //   // await updateData();
  //   setRefreshing(false)
  // }, [])

  // Function to filter attractions based on search query
  const filterAttractions = (query: string): void => {
    const filteredOpenAttractions = openAttractions.filter(attraction =>
      attraction.name.toLowerCase().includes(query.toLowerCase())
    ).slice().sort((a, b) => {
      if (sortAsc) {
        return a.name.localeCompare(b.name)
      } else {
        return b.name.localeCompare(a.name)
      }
    })
    const filteredOtherAttractions = closedAttractions.filter(attraction =>
      attraction.name.toLowerCase().includes(query.toLowerCase())
    ).slice().sort((a, b) => {
      if (sortAsc) {
        return a.name.localeCompare(b.name)
      } else {
        return b.name.localeCompare(a.name)
      }
    })
    setFilteredAttractions([...filteredOpenAttractions, ...filteredOtherAttractions])
  }

  // Handle search query change
  const handleSearch = (query: string): void => {
    setSearchQuery(query)
    filterAttractions(query)
  }

  // Function to toggle sorting order
  const toggleSortOrder = (): void => {
    setSortAsc(prev => !prev)
  }

  return (
    <>
      <View style={styles.subheaderView}>
        <Text style={styles.subheaderText}>@ {park.name}</Text>
      </View>
      <View style={styles.toolsHeaderView}>
        <View style={{ flex: 4 }}>
          {/* Search input field */}
          <TextInput
            style={searchQuery !== '' ? styles.searchBarSelected : styles.searchBar}
            onChangeText={handleSearch}
            value={searchQuery}
            placeholder="Search"
            returnKeyType="done"
            clearButtonMode="always"
          />
        </View>
        <Pressable onPress={toggleSortOrder}>
          {!sortAsc
            ? <View style={styles.subheaderSortAlphaAsc}>
              <Image
                style={{
                  width: 40,
                  height: 40
                }}
                source={require('../icon_imgs/sort-alph-asc.png')}
              />
            </View>
            : <View style={styles.subheaderSortAlphaDesc}>
              <Image
                style={{
                  width: 40,
                  height: 40
                }}
                source={require('../icon_imgs/sort-alph-desc.png')}
              />
            </View>
          }
        </Pressable>
        <Pressable onPress={() => { setShowAdditionalText(prevState => !prevState) }}>
          {showAdditionalText
            ? <View style={styles.subheaderShowDataTrue}>
              <Image
                style={{
                  width: 30,
                  height: 30
                }}
                source={require('../icon_imgs/trends-icon.png')}
              />
            </View>
            : <View style={styles.subheaderShowDataFalse}>
              <Image
                style={{
                  width: 30,
                  height: 30
                }}
                source={require('../icon_imgs/trends-icon.png')}
              />
            </View>
          }
        </Pressable>
      </View>
      <ScrollView
        /* refreshControl={
          <RefreshControl title={"Pull down to refresh"} refreshing={refreshing} onRefresh={onRefresh} />
        } */
      >
        <View style={styles.main}>
          {/* List for filtered attractions */}
          {searchQuery !== ''
            ? filteredAttractions.map((attr: Attraction, index: number) => (
              <Pressable
                key={index}
                style={styles.attractionCard}
                onPress={() => navigation.navigate('Attraction', {
                  attr,
                  timezone: park.timezone
                })}
              >
                <View style={styles.attractionTitle}>
                  <Text style={styles.attractionTitleText}>{attr.name}</Text>
                </View>
                <LiveDataComponent attr={attr} timezone={park.timezone} showAdditionalText={showAdditionalText}/>
              </Pressable>
            ))
            : <>
              {/* List for open attractions */}
              {sortedOpenAttractions.map((attr: Attraction, index: number) => (
                <Pressable
                  key={index}
                  style={styles.attractionCard}
                  onPress={() => navigation.navigate('Attraction', {
                    attr,
                    timezone: park.timezone
                  })}
                >
                  <View style={styles.attractionTitle}>
                    <Text style={styles.attractionTitleText}>{attr.name}</Text>
                  </View>
                  <LiveDataComponent attr={attr} timezone={park.timezone} showAdditionalText={showAdditionalText}/>
                </Pressable>
              ))}
              {/* List for other attractions */}
              <View style={styles.attrAvailSectionView}>
                <Text style={styles.attrAvailSectionText}>Closed Attractions</Text>
              </View>
              {sortedClosedAttractions.map((attr: Attraction, index: number) => (
                <Pressable
                  key={index}
                  style={styles.attractionCard}
                  onPress={() => navigation.navigate('Attraction', {
                    attr,
                    timezone: park.timezone
                  })}
                >
                  <View style={styles.attractionTitle}>
                    <Text style={styles.attractionTitleText}>{attr.name}</Text>
                  </View>
                  <LiveDataComponent attr={attr} timezone={park.timezone} showAdditionalText={showAdditionalText}/>
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
