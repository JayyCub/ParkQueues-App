import { Text, View } from 'react-native'
import { type Attraction, LiveStatusType } from '../Data/Attraction'
import { styles } from '../styles'
import { QueueType, ReturnTimeState } from '../Data/Queue'
import React from 'react'
import { FontAwesome5 } from '@expo/vector-icons'

const downArrow = <FontAwesome5 name={'caret-down'} size={16} color='white' />
const upArrow = <FontAwesome5 name={'caret-up'} size={16} color='white' />

const LiveDataChangeComponent = (
  { attr, timezone, showAdditionalText, intervalStart, intervalEnd }:
  { attr: Attraction, timezone: string, showAdditionalText: boolean, intervalStart: number, intervalEnd: number }): React.JSX.Element => {
  const elements: React.JSX.Element[] = []

  // Check if attraction is NOT operating
  if (attr.status !== LiveStatusType.OPERATING) {
    const status = (() => {
      switch (attr.status) {
        case LiveStatusType.CLOSED:
          return 'Closed'
        case LiveStatusType.DOWN:
          return 'Unexpected Downtime'
        case LiveStatusType.REFURBISHMENT:
          return 'Under Refurbishment'
        default:
          return 'Closed'
      }
    })()

    return (
      <View style={styles.attractionLiveDataView}>
        <View style={styles.liveDataBox}>
          <Text style={styles.liveData3}>{status}</Text>
        </View>
      </View>
    )
  }

  const renderIconElement = (icon: React.JSX.Element | null, diff: number): React.JSX.Element => (
    <View style={{
      width: 35,
      paddingLeft: 3,
      paddingRight: 3,
      borderRadius: 25,
      backgroundColor: diff === 0 ? 'gray' : diff > 0 ? '#b40100' : '#008c01',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row'
    }}>
      {icon}
      <Text style={{
        paddingLeft: 2,
        verticalAlign: 'middle',
        fontWeight: 700,
        fontSize: 14,
        color: '#ffffff'
      }}>
        {Math.abs(diff)}
      </Text>
    </View>
  )

  const renderWaitTimeElement =
    (label: string,
      waitTime: number | null | undefined,
      diff: number,
      icon: React.JSX.Element | null
    ): React.JSX.Element => (
      <>
        <View style={styles.liveDataLabelBox}>
          <Text style={styles.liveDataLabelText}>{label}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <View style={{
            width: 40,
            display: showAdditionalText ? undefined : 'none'
          }} />
          <Text style={styles.liveData3}>
            {waitTime ?? 'Open'}
          </Text>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: 40,
            display: showAdditionalText ? undefined : 'none'
          }}>
            {(icon != null) && renderIconElement(icon, diff)}
          </View>
        </View>
      </>
    )

  const renderUnavailableElement = (label: string): React.JSX.Element => (
    <>
      <View style={styles.liveDataLabelBox}>
        <Text style={styles.liveDataLabelText}>{label}</Text>
      </View>
      <Text style={styles.liveDataUnavailable}>Unavailable</Text>
    </>
  )

  const renderElement = (label: string, data: any): React.JSX.Element => (
    <>
      <View style={styles.liveDataLabelBox}>
        <Text style={styles.liveDataLabelText}>{label}</Text>
      </View>
      <Text style={styles.liveData3}>
        {data}
      </Text>
    </>
  )

  const getWaitTimeDiff = (currentWait: number | undefined, previousWait: number | undefined): {
    icon: null | React.JSX.Element
    diff: number
  } => {
    if (currentWait !== undefined && previousWait !== undefined) {
      const diff = currentWait - previousWait
      if (diff < 0) return { diff, icon: downArrow }
      if (diff > 0) return { diff, icon: upArrow }
    }
    return { diff: 0, icon: null }
  }

  const start = attr.history[attr.history.length - 1 - intervalStart / 5]
  const startWait = start?.queue?.STANDBY?.waitTime
  const end = attr.history[attr.history.length - 1 - intervalEnd / 5]
  const endWait = end?.queue?.STANDBY?.waitTime
  const { diff, icon } = getWaitTimeDiff(endWait, startWait)

  const renderQueueElement = (queueType: QueueType): void => {
    switch (queueType) {
      case QueueType.open_status:
        elements.push(renderElement('Status:', 'Open'))
        break
      case QueueType.standby:
        elements.push(renderWaitTimeElement('Standby:', startWait, diff, icon))
        elements.push(<View style={styles.liveDataDivider} />)
        elements.push(renderWaitTimeElement('Standby:', endWait, diff, null))
        break
      case QueueType.standby_single_reservation:
      case QueueType.standby_single:
        elements.push(renderWaitTimeElement('Standby:', startWait, diff, icon))
        elements.push(<View style={styles.liveDataDivider} />)
        elements.push(renderWaitTimeElement('Standby:', endWait, diff, null))
        break
      case QueueType.boarding_reservation:
        break
      default:
        break
    }
  }

  /*  const renderReservationTimeElement = (): any => {
    const { title, nextTime, price } = (() => {
      const paid = attr.queue.PAID_RETURN_TIME?.returnStart
      const reg = attr.queue.RETURN_TIME?.returnStart
      if (paid !== undefined) {
        const temp = new Date(paid)
        const nextTime = attr.queue.PAID_RETURN_TIME?.state === ReturnTimeState.AVAILABLE
          ? temp.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: timezone })
          : 'Unavailable'
        const price = ((attr.queue.PAID_RETURN_TIME?.price) != null)
          ? `$${(attr.queue.PAID_RETURN_TIME.price.amount / 100).toString()}`
          : undefined
        return { title: 'Next Individual LL:', nextTime, price }
      }
      if (reg !== undefined) {
        const temp = new Date(reg)
        const nextTime = attr.queue.RETURN_TIME?.state === ReturnTimeState.AVAILABLE
          ? temp.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: timezone })
          : 'Unavailable'
        return { title: 'Next Genie+ Reservation:', nextTime, price: undefined }
      }
      return { title: 'Next Reservable Time:', nextTime: 'Unavailable', price: undefined }
    })()

    if (nextTime === 'Unavailable') {
      elements.push(renderUnavailableElement(title))
    } else {
      elements.push(renderElement(title, nextTime))
    }
    if (price !== undefined) {
      elements.push(<View style={styles.liveDataDivider} />)
      elements.push(renderElement('Price:', price))
    }
  } */

  switch (attr.queue.queueType) {
    case QueueType.standby_reservation:
      renderQueueElement(QueueType.standby)
      // elements.push(<View style={styles.liveDataDivider} />)
      // renderReservationTimeElement()
      break
    case QueueType.boarding_reservation:
      renderQueueElement(QueueType.boarding_reservation)
      // elements.push(<View style={styles.liveDataDivider} />)
      // renderReservationTimeElement()
      break
    case QueueType.standby_single_reservation:
      renderQueueElement(QueueType.standby_single)
      // elements.push(<View style={styles.liveDataDivider} />)
      // renderReservationTimeElement()
      break
    default:
      renderQueueElement(attr.queue.queueType)
      break
  }

  return (
    <View style={{ width: '100%' }}>
      {elements.length <= 5
        ? <View style={styles.attractionLiveDataView}>
          {elements.map((element, index) => {
            return <View style={index % 2 === 1 ? null : styles.liveDataBox} key={index}>
              {element}
            </View>
          })}
        </View>
        : <View style={{ width: '100%' }}>
          <View style={styles.attractionLiveDataView}>
            {elements.slice(0, 3).map((element, index) => {
              return <View style={index % 2 === 1 ? null : styles.liveDataBox} key={index}>
                {element}
              </View>
            })}
          </View>
          <View style={{
            borderStyle: 'solid',
            borderBottomWidth: 1,
            borderColor: 'lightgray',
            margin: 5
          }} />
          <View style={styles.attractionLiveDataView}>
            {elements.slice(4).map((element, index) => {
              return <View style={index % 2 === 1 ? null : styles.liveDataBox} key={index}>
                {element}
              </View>
            })}
          </View>
        </View>
      }
    </View>
  )
}

export default LiveDataChangeComponent
