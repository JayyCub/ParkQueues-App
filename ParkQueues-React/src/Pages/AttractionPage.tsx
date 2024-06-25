import { type Attraction, LiveStatusType } from '../Data/Attraction'
import { styles } from '../styles'
import { ScrollView, Text, View } from 'react-native'
import React, { useState } from 'react'
import LiveDataComponent from '../Components/LiveDataComponent'
import { type Queue, QueueType, ReturnTimeState } from '../Data/Queue'
import SingleLineAreaChart from '../Components/SingleLineAreaChart'
import TwoLineAreaChart, { type DataItem } from '../Components/TwoLineAreaChart'
import TimeAreaChart, { type ReturnDataItem } from '../Components/TimeAreaChart'

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
                <Text style={styles.attractionLiveText}>Live:</Text>
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

  const renderChart = (title: string, data: any, Component: any): React.JSX.Element => (
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
           {historicStandby.length === attr.history.length &&
            renderChart('Standby Wait History:', historicStandby, SingleLineAreaChart)}
           {historicSingleRider.length === attr.history.length &&
            renderChart('Single Rider Wait History:', historicSingleRider, SingleLineAreaChart)}
           {historicBoardingGroup.length === attr.history.length &&
            renderChart('Boarding Group History:', historicBoardingGroup, TwoLineAreaChart)}
          {(historicReturnTime.length === attr.history.length) &&
            renderChart('Next Reservation Time History:', historicReturnTime, TimeAreaChart)}
        </View>
      </ScrollView>
    </>
  )
}

export default AttractionPage
