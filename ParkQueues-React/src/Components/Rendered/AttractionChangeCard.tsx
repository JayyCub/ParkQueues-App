import React, { useEffect, useState } from 'react'
import { Alert, Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colorPalette, styles } from '../../styles'
import LiveDataComponent from './LiveDataComponent'
import { type Attraction } from '../../Data/Attraction'
import { useDataContext } from '../../Data/DataContext'
import { UserDataAttr } from '../../Data/UserData'
import LoadingPopup from './LoadingPopup'
import LiveDataChangeComponent from './LiveDataChangeComponent'

interface AttractionCardProps {
  attr: Attraction
  timezone: string
  showAdditionalText: boolean
  navigation: any
  favorite: boolean
  destId: string
  parkId: string
  navStack: string
  intervalStart: number
  intervalEnd: number
}

const AttractionChangeCard: React.FC<AttractionCardProps> = (
  { attr, timezone, showAdditionalText, navigation, favorite, destId, parkId, navStack, intervalStart, intervalEnd }) => {
  const { userData, updateUserData } = useDataContext()
  const [isAdding, setIsAdding] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [isFavorite, setIsFavorite] = useState(favorite)

  useEffect(() => {
    setIsFavorite(favorite)
  }, [userData])

  const handleFavorite = async (): Promise<void> => {
    if (userData != null) {
      if (!favorite) { // Attr is not favorited, need to add to fav list
        setIsAdding(true)

        if (userData.favs.length < userData.maxFavs.num) { // Is allowed to add more
          userData.favs.push(new UserDataAttr(destId, parkId, attr.id, Date.now(), null))
          const url = 'https://7o2vcnfjgc.execute-api.us-east-1.amazonaws.com/ParkQueues-live/user-data'
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-type': 'application/json'
            },
            body: userData?.toJson()
          })

          if (response.status === 200) {
            updateUserData().then(() => {
              setIsFavorite(true)
            })
          } else {
            setIsFavorite(false)
          }
        } else {
          setIsAdding(false)
          Alert.alert('Too many favorites', 'You already have the maximum number of favorite attractions.')
        }
        setIsAdding(false)
      } else { // Attr already in favorites list, need to remove from fav list)
        setIsRemoving(true)
        userData.favs = userData.favs.filter(a => a.id !== attr.id)
        const url = 'https://7o2vcnfjgc.execute-api.us-east-1.amazonaws.com/ParkQueues-live/user-data'
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: userData?.toJson()
        })

        if (response.status === 200) {
          updateUserData().then(() => {
            setIsFavorite(false)
          })
        } else {
          setIsFavorite(true)
        }
        setIsRemoving(false)
      }
    } else {
      Alert.alert('Sign in or create an account to save favorite attractions')
    }
  }

  return (
    <>
      <Pressable
        style={[styles.attractionCard, { marginTop: 0 }]}
        onPress={() => navigation.navigate(navStack, { attr, timezone })}
      >
        <View style={styles.attractionTitle}>
          <Text style={styles.attractionTitleText}>{attr.name}</Text>
          <Pressable
            style={{ width: '8%', justifyContent: 'center', alignItems: 'center' }}
            onPress={handleFavorite}
          >
            <Ionicons name="star" color={isFavorite || (navStack === 'FavAttraction') ? colorPalette.layer3b : 'lightgray'} size={26} />
          </Pressable>
        </View>
        <LiveDataChangeComponent
          attr={attr}
          timezone={timezone}
          showAdditionalText={showAdditionalText}
          intervalStart={intervalStart}
          intervalEnd={intervalEnd}/>
      </Pressable>
      {isAdding
        ? <LoadingPopup message='Adding favorite...' />
        : <></>
      }
      {isRemoving
        ? <LoadingPopup message='Removing favorite...' />
        : <></>
      }
    </>
  )
}

export default AttractionChangeCard
