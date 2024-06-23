import { type Attraction } from '../Data/Attraction'
import { styles } from '../styles'
import { ScrollView, Text, View } from 'react-native'
import React, { useState } from 'react'
import LiveDataComponent from '../Components/LiveDataComponent'
import { QueueType } from '../Data/Queue'
import SingleLineAreaChart from '../Components/SingleLineAreaChart'
import TwoLineAreaChart from '../Components/TwoLineAreaChart'

const AttractionPage = ({ route }: any): React.JSX.Element => {
  const [attr] = useState<Attraction>(route.params?.attr)

  const historicStandby: Array<{ high: number | undefined, date: number }> = []
  const historicSingleRider: Array<{ high: number | undefined, date: number }> = []
  const historicBoardingGroup: Array<{ start: number | undefined, end: number | undefined, date: number }> = []

  const getWaitTime = (queue: any, type: string): number => {
    if (queue[type] !== undefined) {
      return queue[type].waitTime !== null ? queue[type].waitTime : 1
    }
    return -1
  }

  attr.history.forEach((value) => {
    const date = new Date(value.time).getTime()
    switch (value.queue.queueType) {
      case QueueType.open_status:
        historicStandby.push({ high: 1, date })
        break
      case QueueType.standby:
      case QueueType.standby_reservation:
        historicStandby.push({ high: getWaitTime(value.queue, 'STANDBY'), date })
        break
      case QueueType.boarding_reservation:
        if (value.queue.BOARDING_GROUP !== undefined) {
          historicBoardingGroup.push({
            start: value.queue.BOARDING_GROUP.currentGroupStart ?? undefined,
            end: value.queue.BOARDING_GROUP.currentGroupEnd ?? undefined,
            date
          })
        }
        break
      case QueueType.standby_single_reservation:
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
        break
      default:
        break
    }
  })

  const renderChart = (title: string, data: any, Component: any) => (
    <View style={styles.attractionLiveDataCard}>
      <View style={{ width: '100%', height: 'auto' }}>
        <View style={styles.attractionTitle}>
          <Text style={styles.attractionPageHeaderText}>{title}</Text>
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

  console.log(JSON.stringify(attr.name))
  console.log(JSON.stringify(attr.queue))

  return (
    <>
      <View style={styles.subheaderView}>
        <Text style={styles.subheaderText}>{attr.name}</Text>
      </View>
      <ScrollView>
        <View style={styles.main}>
          <View style={styles.attractionLiveDataCard}>
            <View style={styles.attractionTitle}>
              <Text style={styles.attractionLiveText}>Live:</Text>
            </View>
            <LiveDataComponent attr={attr} timezone={route.params.timezone} showAdditionalText={false} />
          </View>
          {(attr.queue.queueType === QueueType.standby ||
              attr.queue.queueType === QueueType.standby_single ||
              attr.queue.queueType === QueueType.standby_single_reservation ||
              attr.queue.queueType === QueueType.open_status ||
              attr.queue.queueType === QueueType.standby_reservation) &&
            renderChart('Standby Wait History:', historicStandby, SingleLineAreaChart)}
          {(attr.queue.queueType === QueueType.standby_single ||
              attr.queue.queueType === QueueType.standby_single_reservation) &&
            renderChart('Single Rider Wait History:', historicSingleRider, SingleLineAreaChart)}
          {attr.queue.queueType === QueueType.boarding_reservation &&
            renderChart('Boarding Group History:', historicBoardingGroup, TwoLineAreaChart)}
        </View>
      </ScrollView>
    </>
  )
}

export default AttractionPage
