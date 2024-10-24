import { type Attraction, LiveStatusType } from '../Data/Attraction'
import { styles } from '../styles'
import { Alert, Pressable, ScrollView, Text, View } from 'react-native'
import React, { useState } from 'react'
import LiveDataComponent from '../Components/Rendered/LiveDataComponent'
import { type Queue, QueueType, ReturnTimeState } from '../Data/Queue'
import SingleLineAreaChart from '../Components/Rendered/SingleLineAreaChart'
import TwoLineAreaChart, { type DataItem } from '../Components/Rendered/TwoLineAreaChart'
import TimeAreaChart, { type ReturnDataItem } from '../Components/Rendered/TimeAreaChart'
import { Ionicons } from '@expo/vector-icons'

const tooltips = {
  standby: 'This graph shows the standby wait times from the past 8 hours, updated every five minutes. Use this to spot trends in today\'s data or check if an attraction has just reopened.\n\nIt\'s a great tool to help plan your day!',
  singleRider: 'This graph displays the single rider wait times from the past 8 hours, updated every five minutes. Use it to find trends or check if an attraction has just reopened. \n\nIf you\'re comfortable riding solo, this can help you find rides with a queue for you!',
  boardingGroups: 'This graph tracks the boarding groups over the past 8 hours, updated every five minutes. Use it to see trends or check if an attraction has experienced delays or downtime. \n\nStay informed so you\'re never caught off-guard by your boarding group!',
  nextReservation: 'This graph shows the next available attraction reservation times over the past 8 hours. The gray area visualizes how far in advance the next reservation is from that point in time. \n\nUse this to decide which rides to get a reservation for!'
}

const AttractionPage = ({ route }: any): React.JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const [attr] = useState<Attraction>(route.params?.attr)

  if (attr.status === LiveStatusType.REFURBISHMENT || attr.status === LiveStatusType.CLOSED) {
    return (
      <>
        <View style={styles.subheaderView}>
          <Text style={styles.subheaderText}>{attr.name}</Text>
        </View>
        <ScrollView>
          <View style={styles.main}>
            <View style={styles.attractionLiveDataCard}>
              <View style={styles.attractionTitle}>
                <Text style={styles.attractionLiveText}>Now:</Text>
              </View>
              <LiveDataComponent attr={attr} timezone={route.params.timezone} showAdditionalText={false} />
            </View>
          </View>
        </ScrollView>
      </>
    )
  }

  const historicStandby: Array<{ high: number | undefined, date: number }> = []
  const historicSingleRider: Array<{ high: number | undefined, date: number }> = []
  const historicBoardingGroup: DataItem[] = []
  const historicReturnTime: ReturnDataItem[] = []

  const getWaitTime = (queue: any, type: string): number => {
    if (queue[type] !== undefined) {
      return queue[type].waitTime !== null ? queue[type].waitTime : 1
    }
    return -1
  }

  const getReturnTime = (queue: Queue): number | undefined => {
    if (queue.PAID_RETURN_TIME != null) {
      if (queue.PAID_RETURN_TIME.state === ReturnTimeState.FINISHED) {
        return undefined
      } else {
        const val = new Date(queue.PAID_RETURN_TIME.returnStart)
        if (val.getMinutes() === 59) {
          return undefined
        }
        return val.getTime()
      }
    } else if (queue.RETURN_TIME != null) {
      if (queue.RETURN_TIME.state === ReturnTimeState.FINISHED) {
        return undefined
      } else {
        const val = new Date(queue.RETURN_TIME.returnStart)
        if (val.getMinutes() === 59) {
          return undefined
        }
        return val.getTime()
      }
    }
    return undefined
  }

  attr.history.forEach((value) => {
    const date = new Date(value.time).getTime()
    switch (value.queue.queueType) {
      case QueueType.open_status:
        historicStandby.push({ high: 1, date })
        break
      case QueueType.standby:
        historicStandby.push({ high: getWaitTime(value.queue, 'STANDBY'), date })
        break
      case QueueType.standby_reservation:
        historicStandby.push({ high: getWaitTime(value.queue, 'STANDBY'), date })
        historicReturnTime.push({ histTime: date - (1000 * 60 * 5), returnTime: getReturnTime(value.queue), date })
        break
      case QueueType.boarding_reservation:
        if (value.queue.BOARDING_GROUP !== undefined) {
          historicBoardingGroup.push({
            start: value.queue.BOARDING_GROUP.currentGroupStart ?? undefined,
            end: value.queue.BOARDING_GROUP.currentGroupEnd ?? undefined,
            date
          })
        }
        historicReturnTime.push({ histTime: date - (1000 * 60 * 5), returnTime: getReturnTime(value.queue), date })
        break
      case QueueType.standby_single_reservation:
        historicStandby.push({ high: getWaitTime(value.queue, 'STANDBY'), date })
        historicSingleRider.push({ high: getWaitTime(value.queue, 'SINGLE_RIDER'), date })
        historicReturnTime.push({ histTime: date - (1000 * 60 * 5), returnTime: getReturnTime(value.queue), date })
        break
      case QueueType.standby_single:
        historicStandby.push({ high: getWaitTime(value.queue, 'STANDBY'), date })
        historicSingleRider.push({ high: getWaitTime(value.queue, 'SINGLE_RIDER'), date })
        break
      case QueueType.undetermined:
        historicStandby.push({ high: -6, date })
        break
      case QueueType.closed:
        historicStandby.push({ high: undefined, date })
        historicSingleRider.push({ high: undefined, date })
        historicBoardingGroup.push({ start: undefined, end: undefined, date })
        historicReturnTime.push({ histTime: date - (1000 * 60 * 5), returnTime: getReturnTime(value.queue), date })
        break
      default:
        break
    }
  })

  const graphTooltip = (tooltip: string): any => {
    Alert.alert('What is this graph?', tooltip)
  }

  const renderChart = (title: string, data: any, Component: any, tooltip: string): React.JSX.Element => (
    <View style={styles.attractionLiveDataCard}>
      <View style={{ width: '100%', height: 'auto' }}>
        <View style={styles.attractionTitle}>
          <Text style={styles.attractionPageHeaderText}>{title}</Text>
          <Pressable
            style={{ width: '8%', justifyContent: 'center', alignItems: 'center' }}
            onPress={() => graphTooltip(tooltip)}
          >
            <Ionicons name="help-circle-outline" size={26} color="gray" />
          </Pressable>
        </View>
        <Component data={data} timezone={route.params.timezone} />
      </View>
      <View style={{ flexDirection: 'row', marginBottom: 5 }}>
        <View style={{ width: '50%', paddingLeft: 2 }}>
          <Text>8 hours ago</Text>
        </View>
        <View style={{ width: '50%', paddingRight: 2, alignItems: 'flex-end' }}>
          <Text>Now</Text>
        </View>
      </View>
    </View>
  )

  return (
    <>
      <View style={styles.subheaderView}>
        <Text style={styles.subheaderText}>{attr.name}</Text>
      </View>
      <ScrollView>
        <View style={styles.main}>
          <View style={styles.attractionLiveDataCard}>
            <View style={styles.attractionTitle}>
              <Text style={styles.attractionLiveText}>Now:</Text>
            </View>
            <LiveDataComponent attr={attr} timezone={route.params.timezone} showAdditionalText={false} />
          </View>
           {historicStandby.length === attr.history.length &&
            renderChart('Standby Wait History:', historicStandby, SingleLineAreaChart, tooltips.standby)}
           {historicSingleRider.length === attr.history.length &&
            renderChart('Single Rider Wait History:', historicSingleRider, SingleLineAreaChart, tooltips.singleRider)}
           {historicBoardingGroup.length === attr.history.length &&
            renderChart('Boarding Group History:', historicBoardingGroup, TwoLineAreaChart, tooltips.boardingGroups)}
          {(historicReturnTime.length === attr.history.length) &&
            renderChart('Next Reservation Time History:', historicReturnTime, TimeAreaChart, tooltips.nextReservation)}
        </View>
      </ScrollView>
    </>
  )
}

export default AttractionPage
