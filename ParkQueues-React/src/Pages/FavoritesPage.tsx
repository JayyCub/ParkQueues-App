import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDataContext } from '../Data/DataContext'
import { type Attraction } from '../Data/Attraction'
import { colorPalette, fontFamily, styles } from '../styles'
import AttractionCard from '../Components/Rendered/AttractionCard'
import { type UserDataAttr } from '../Data/UserData'

const FavoritesPage = ({ route, navigation }: any): React.JSX.Element => {
  const { lastUpdated, refreshData, showTrends, toggleShowTrends, sortAlpha, userData, updateUserData, destinations } = useDataContext()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filteredAttractions, setFilteredAttractions] = useState<Attraction[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const attractions = new Map<string, Attraction>()
  const attrMap = new Map<string, UserDataAttr>()
  userData?.favs.forEach((attr) => {
    const tempAttr = destinations.get(attr.destId)?.parks[attr.parkId].liveData[attr.id]
    if (tempAttr != null) {
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

  const watchAd = (): void => {
    console.log('Watching advertisement')
    if (userData?.maxFavs?.num != null) {
      console.log('Watched an ad')
      // userData?.maxFavs.expirationStack.push({
      //   expiration: Date.now() + (1000 * 60 * 60 * 24),
      //   newMaxFav: userData?.maxFavs.num
      // })
      // userData.maxFavs.num += 3
      // console.log('There')
      // const url = 'https://7o2vcnfjgc.execute-api.us-east-1.amazonaws.com/ParkQueues-live/user-data'
      // fetch(url, {
      //   method: 'POST',
      //   headers: {
      //     'Content-type': 'application/json'
      //   },
      //   body: userData?.toJson()
      // }).then((response) => {
      //   console.log('Erm')
      //
      //   if (response.status === 200) {
      //     updateUserData()
      //     console.log('Successfully watched ad!')
      //   } else {
      //     console.log('Error watching ad...')
      //     console.log(response)
      //   }
      // })
    } else {
      console.log('Error handling local userdata')
    }
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
        {/* <Pressable onPress={toggleSortAlpha}>
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
        </Pressable> */}
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
          {userData?.maxFavs != null
            ? <>
          {/* {attractions.size === 0
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
                    'favorites will eventually increase as development progresses. \n\nThank you for your patience!')
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
            : null} */}
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
            : allAttractions.map((attr: Attraction, index: number) => {
              const localDest = destinations.get(attrMap.get(attr.id)!.destId)
              const localPark = localDest?.parks[attrMap.get(attr.id)!.parkId]
              const localParkName = ((localDest?.name.includes('Paris')) === true)
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
          <Text style={{
            fontSize: 18,
            fontFamily,
            width: '75%',
            textAlign: 'center',
            marginTop: 20,
            color: colorPalette.layer1,
            fontStyle: 'italic'
          }}>
            You can select up to {userData.maxFavs.num} Favorites
          </Text>
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20
            }}
            onPress={() => {
              Alert.alert(`Why only ${userData.maxFavs.num} favorites?', 'This app is still in development. The amount of possible ` +
                'favorites will eventually increase as development progresses. \n\nThank you for your patience!')
            }}
            >
            {/*<Text style={{
              fontSize: 18,
              fontFamily,
              textAlign: 'center',
              color: colorPalette.layer1,
              textDecorationLine: 'underline'
            }}>Why?</Text>*/}
          </Pressable>
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20
            }}
            onPress={() => {
              if (userData?.maxFavs.num != null && userData.maxFavs.num >= 20) {
                // Already at max num of favs
                Alert.alert('You have reached the maximum number of favorite selections.')
                return
              }

              Alert.alert('Watch an ad to unlock more favorites?',
                'Every ad you watch rewards you with 3 more favorite attraction selections for 24 hours. ' +
                'Would you like to watch an ad now?',
                [
                  { text: 'No', onPress: () => {} },
                  { text: 'Yes', onPress: () => { watchAd() } }
                ])
            }}
          >
            {/*<Text style={{
              fontSize: 18,
              fontFamily,
              textAlign: 'center',
              color: colorPalette.layer1,
              textDecorationLine: 'underline'
            }}>Want to save more favorites?</Text>*/}
          </Pressable>
          </>
            : <View style={{ height: 100, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size='large'/>
                <View style={{ height: 10 }}/>
                <Text style={{ fontSize: 24 }}>Gathering favorite attractions...</Text>
              </View>
          }
        </View>
      </ScrollView>
    </>
  )
}

export default FavoritesPage
