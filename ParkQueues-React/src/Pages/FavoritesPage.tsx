import { Alert, Image, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDataContext } from '../Data/DataContext'
import { type Attraction, LiveStatusType } from '../Data/Attraction'
import { colorPalette, fontFamily, styles } from '../styles'
import AttractionCard from '../Components/AttractionCard'
import { type UserDataAttr } from '../Data/UserData'
import { AntDesign } from '@expo/vector-icons'

const FavoritesPage = ({ route, navigation }: any): React.JSX.Element => {
  const { parks, lastUpdated, refreshData, showTrends, toggleShowTrends, sortAlpha, toggleSortAlpha, userData, destinations } = useDataContext()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filteredAttractions, setFilteredAttractions] = useState<Attraction[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const attractions = new Map<string, Attraction>()
  const attrMap = new Map<string, UserDataAttr>()
  userData?.favs.forEach((attr) => {
    const tempAttr = destinations.get(attr.destId)?.parks[attr.parkId].liveData[attr.id]
    if (tempAttr) {
      attractions.set(attr.id, tempAttr)
      attrMap.set(attr.id, attr)
    }
  })

  const favAttrs: string[] = []
  userData?.favs.forEach(attr => favAttrs.push(attr.id))

  useEffect(() => {
    filterAttractions(searchQuery)
  }, [searchQuery, sortAlpha, showTrends, lastUpdated])

  const allAttractions = Array.from(attractions.values())

  const sortedAttractions = allAttractions.slice().sort((a, b) => {
    return sortAlpha ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  })

  const filterAttractions = (query: string): void => {
    const filtered = allAttractions.filter(attraction =>
      attraction.name.toLowerCase().includes(query.toLowerCase())
    ).slice().sort((a, b) => {
      return sortAlpha ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    })
    setFilteredAttractions(filtered)
  }

  const handleSearch = (query: string): void => {
    setSearchQuery(query)
    filterAttractions(query)
  }

  const onRefresh = (): void => {
    setRefreshing(true)
    refreshData().then(() => {
      setRefreshing(false)
    })
  }

  return (
    <>
      <View style={styles.subheaderView}>
        <Text style={styles.subheaderText}>Favorite Attractions</Text>
      </View>
      <View style={styles.toolsHeaderView}>
        <View style={{ flex: 4 }}>
          <TextInput
            style={searchQuery !== '' ? styles.searchBarSelected : styles.searchBar}
            onChangeText={handleSearch}
            value={searchQuery}
            placeholder="Search Favorites"
            returnKeyType="done"
            clearButtonMode="always"
          />
        </View>
        <Pressable onPress={toggleSortAlpha}>
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
        <Pressable onPress={toggleShowTrends}>
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
          {attractions.size === 0
            ? <>
              <Text style={{
                fontSize: 18,
                fontFamily,
                width: '75%',
                textAlign: 'center',
                marginTop: 20,
                color: colorPalette.layer1,
                fontStyle: 'italic'
              }}>
                Find an attraction and press the star to add it to your Favorites!
                {'\n\n\n\n'}You can select up to 5 Favorites
              </Text>
              <Pressable
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 20
                }}
                onPress={() => {
                  Alert.alert('Why only 5 favorites?', 'This app is still in development and the amount of possible ' +
                    'favorites will eventually increase as development details are figured out. \n\nThank you for your patience!')
                }}
              >
                <Text style={{
                  fontSize: 18,
                  fontFamily,
                  textAlign: 'center',
                  color: colorPalette.layer1,
                  textDecorationLine: 'underline'
                }}>Why?</Text>
              </Pressable>
            </>
            : null}
          {searchQuery !== ''
            ? filteredAttractions.map((attr: Attraction, index: number) => {
              const localDest = destinations.get(attrMap.get(attr.id)!.destId)
              const localPark = localDest?.parks[attrMap.get(attr.id)!.parkId]

              return <AttractionCard
                key={index}
                attr={attr}
                timezone={localPark?.timezone!}
                showAdditionalText={showTrends}
                navigation={navigation}
                favorite={favAttrs.includes(attr.id)}
                parkId={localPark?.id!}
                destId={localDest?.id!}
                navStack='FavAttraction'
              />
            })
            : sortedAttractions.map((attr: Attraction, index: number) => {
              const localDest = destinations.get(attrMap.get(attr.id)!.destId)
              const localPark = localDest?.parks[attrMap.get(attr.id)!.parkId]
              const localParkName = localDest?.name.includes('Paris')
                ? 'Disneyland - Paris'
                : localPark?.name.replace(/Disney's|Water Park| Park| Theme/g, '')

              return (
                <View key={index}>
                  <View style={styles.favAttrDest}>
                    <Text style={styles.favAttrParkText}>
                      {localParkName}
                    </Text>
                  </View>
                  <AttractionCard
                    key={index}
                    attr={attr}
                    timezone={localPark?.timezone!}
                    showAdditionalText={showTrends}
                    navigation={navigation}
                    favorite={favAttrs.includes(attr.id)}
                    parkId={localPark?.id!}
                    destId={localDest?.id!}
                    navStack='FavAttraction'
                  />
                </View>
              )
            })
          }
        </View>
      </ScrollView>
    </>
  )
}

export default FavoritesPage
