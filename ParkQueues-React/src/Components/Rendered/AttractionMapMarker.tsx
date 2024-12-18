import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { type Attraction, LiveStatusType } from '../../Data/Attraction'
import { QueueType } from '../../Data/Queue'
import { FontAwesome5 } from '@expo/vector-icons'

interface AttractionCardProps {
  attr: Attraction
  // timezone: string
  showAdditionalText: boolean
  // navigation: any
  // favorite: boolean
  // destId: string
  // parkId: string
  // navStack: string
  // hideFav?: boolean
}

const downArrow = <FontAwesome5 name={'caret-down'} size={16} color="white" />
const upArrow = <FontAwesome5 name={'caret-up'} size={16} color="white" />

const AttractionMapMarker: React.FC<AttractionCardProps> = ({
  attr,
  showAdditionalText
}) => {
  const pressedAttraction = (attr: Attraction): void => {
    // console.log('Pressed', attr.name)
  }

  const getFirstLiveDataItem = (): React.JSX.Element => {
    let main: React.JSX.Element = <></>
    const currentWait = attr.queue.STANDBY?.waitTime ?? 'Open'
    const prev = attr.history[attr.history.length - 2]
    const prevWait = prev?.queue?.STANDBY?.waitTime
    const diff = currentWait !== 'Open' && prevWait !== undefined ? currentWait - prevWait : 0

    switch (attr.queue.queueType) {
      case QueueType.standby:
      case QueueType.standby_single:
      case QueueType.standby_reservation:
      case QueueType.standby_single_reservation:
        main = (
          <View style={{}}>
            <Pressable
              style={{
                backgroundColor: 'white',
                paddingVertical: 2,
                paddingHorizontal: 6,
                borderRadius: 50,
                borderWidth: 1.5,
                borderColor: 'gray',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: 'black',
                shadowRadius: 2,
                shadowOffset: { width: 0, height: 3 },
                minWidth: 40,
                zIndex: 2
              }}
              onPress={() => { pressedAttraction(attr) }}

            >
              <View style={{ alignItems: 'center' }}>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{currentWait}</Text>
                </View>
              </View>
            </Pressable>
            {(diff !== 0 && showAdditionalText) && (
              <View
                style={{
                  backgroundColor: diff > 0 ? 'rgba(243,0,0,0.5)' : 'rgba(0,186,0,0.5)',
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                  marginTop: -15,
                  paddingTop: 15,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1.5,
                  borderColor: 'white',
                  zIndex: 0
                }}
              >
                {diff > 0 ? upArrow : downArrow}
                <Text style={{ fontSize: 14, color: 'white', marginLeft: 0, fontWeight: 'bold' }}>{Math.abs(diff)}</Text>
              </View>
            )}

          </View>
        )
        break
      case QueueType.boarding_reservation:
        main = (
          <Pressable
            style={{
              backgroundColor: 'white',
              paddingVertical: 2,
              paddingHorizontal: 6,
              borderRadius: 50,
              borderWidth: 1.5,
              borderColor: 'gray',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: 'black',
              shadowRadius: 2,
              shadowOffset: { width: 0, height: 3 },
              minWidth: 40
            }}
            onPress={() => { pressedAttraction(attr) }}
          >
            <View style={{ alignItems: 'center' }}>
              <Text>Boarding:</Text>
              <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{attr.queue.BOARDING_GROUP?.currentGroupStart} - {attr.queue.BOARDING_GROUP?.currentGroupEnd}</Text>
              </View>
            </View>
          </Pressable>
        )
        break
      case QueueType.open_status:
      case QueueType.closed:
      case QueueType.undetermined:
        main = (
          <Pressable
            style={{
              backgroundColor: 'white',
              paddingVertical: 2,
              paddingHorizontal: 6,
              borderRadius: 50,
              borderWidth: 1.5,
              borderColor: 'gray',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: 'black',
              shadowRadius: 2,
              shadowOffset: { width: 0, height: 3 },
              minWidth: 40
            }}
            onPress={() => { pressedAttraction(attr) }}
          >
            <View style={{ alignItems: 'center' }}>
              <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                {attr.status === LiveStatusType.OPERATING
                  ? <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Open</Text>
                  : <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#484848' }}>Closed</Text>
                }
              </View>
            </View>
          </Pressable>
        )
        break
    }

    return main
  }

  return (
    <>
      {getFirstLiveDataItem()}
    </>
  )
}

export default AttractionMapMarker
