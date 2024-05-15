import {Image, Text, View} from "react-native";
import {Attraction, LiveStatusType} from "../Data/Attraction";
import {styles} from "../styles/styles";
import {QueueType, ReturnTimeState} from "../Data/Queue";
import React from "react";

const downArrow = require("../images/diag-down.png");
const upArrow = require("../images/diag-up.png");
const flatLine = require("../images/flat-line.png");

const LiveDataComponent = (
  { attr, timezone, showAdditionalText }:
    { attr: Attraction, timezone: string, showAdditionalText: boolean}) => {
  let elements: any[] = [];
  let status;

  function renderAdditionalText() {
    if (showAdditionalText) {
      return (
        <Text>+info+</Text>
      );
    }
    return null;
  }

  const additionalText = renderAdditionalText();

  // Check if attraction is NOT operating
  if (attr.status !== LiveStatusType.OPERATING) {
    switch (attr.status) {
      case LiveStatusType.CLOSED:
        status = "Closed";
        break;
      case LiveStatusType.DOWN:
        status = "Unexpected Downtime";
        break;
      case LiveStatusType.REFURBISHMENT:
        status = "Under Refurbishment";
        break;
      default:
        status = "Closed";
        break;
    }

    return (
      <View style={styles.attractionLiveDataView}>
        <View style={styles.liveDataBox}>
          <Text style={styles.liveData3}>
            {status}
          </Text>
        </View>
      </View>
    );
  }

  function statusElement() {
    elements.push((
      <>
        {/*<View style={styles.liveDataLabelBox}>
          <Text style={styles.liveDataLabelText}>Status:</Text>
        </View>*/}
        <Text style={styles.liveData2}>Open</Text>
      </>
    ));
  }

  function standbyElement() {
    let diff = 0;
    let icon;

    let prev = attr.history[attr.history.length - 2];
    if (prev) {
      let prevStatus = prev.status;
      let prevQueue = prev.queue;

      let currWait: number | undefined = attr.queue.STANDBY?.waitTime

      if (prevStatus !== undefined && prevQueue !== undefined
        && prevQueue.STANDBY?.waitTime !== undefined
        && prevStatus === LiveStatusType.OPERATING
        && currWait !== undefined) {
        let prevWait = prevQueue.STANDBY?.waitTime;
        diff = (currWait - prevWait);
        if (currWait < prevWait) {
          icon = downArrow;
        } else if (currWait > prevWait) {
          icon = upArrow;
        } else if (currWait === prevWait) {
          icon = flatLine;
        }
      }
    }

    let iconElement =
      <Image
        style={{ width: 18, height: 18, marginLeft: 5}}
        source={icon}
        resizeMode="contain" />;
    let diffElement =
      <Text style={{
        marginLeft: 2,
        verticalAlign: "middle",
        fontWeight: "bold",
        fontSize: 13,
        color: diff === 0? "gray" : diff > 0 ? "#b40100" : "#008c01"
      }}>
        {Math.abs(diff)}
      </Text>

    elements.push((
      <>
        <View style={styles.liveDataLabelBox}>
          <Text style={styles.liveDataLabelText}>Standby:</Text>
        </View>
        <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
          <View style={{
            width: 40,
            display: showAdditionalText ? undefined : "none"
          }} />

          <Text style={styles.liveData3}>
            {attr.queue.STANDBY?.waitTime !== null ?
              (<>{attr.queue.STANDBY?.waitTime}</>) : "Open"}
          </Text>

          <View style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: 40,
            display: showAdditionalText ? undefined : "none",
          }}>
            { iconElement.props.source === undefined ? null : iconElement}
            { diffElement }
          </View>
        </View>
      </>
    ));
  }

  function singleRiderElement() {
    let element;
    if (attr.queue.SINGLE_RIDER?.waitTime !== null) {
      element = <Text style={styles.liveData3}>
        {attr.queue.SINGLE_RIDER?.waitTime}
      </Text>
    } else {
      element = <Text style={styles.liveDataUnavailable}>Unavailable</Text>
    }

    elements.push((
      <>
        <View style={styles.liveDataLabelBox}>
          <Text style={styles.liveDataLabelText}>Single Rider:</Text>
        </View>
        {element}
      </>
    ));
  }

  function boardingGroupElement() {
    elements.push((
      <>
        <View style={styles.liveDataLabelBox}>
          <Text style={styles.liveDataLabelText}>Now Boarding:</Text>
        </View>
        <Text style={styles.liveData3}>
          {attr.queue.BOARDING_GROUP?.currentGroupStart}
          -
          {attr.queue.BOARDING_GROUP?.currentGroupEnd}
        </Text>
      </>
    ));
  }

  function reservationTimeElement() {
    let paid = attr.queue.PAID_RETURN_TIME?.returnStart;
    let reg = attr.queue.RETURN_TIME?.returnStart;
    let title: string;
    let nextTime: string;
    let price: string | undefined;

    if (paid !== undefined) {
      title = "Next Individual LL:";
      if (attr.queue.PAID_RETURN_TIME?.state === ReturnTimeState.AVAILABLE) {
        let temp = new Date(paid);
        nextTime = temp.toLocaleString('en-US',
          { hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: timezone,
          });
      } else {
        nextTime = "Unavailable";
      }
      if (attr.queue.PAID_RETURN_TIME?.price.currency !== undefined) {
        price = "$" + (attr.queue.PAID_RETURN_TIME.price.amount / 100).toString();
      }

    } else if (reg !== undefined ) {
      title = "Next Genie+ Reservation:";
      if (attr.queue.RETURN_TIME?.state === ReturnTimeState.AVAILABLE) {
        let temp = new Date(reg);
        nextTime = temp.toLocaleString('en-US',
          { hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: timezone,
          });
      } else {
        nextTime = "Unavailable";
      }
    } else {
      title = "Next Reservable Time:";
      nextTime = "Unavailable"
    }

    elements.push(
        <View style={styles.liveDataBox}>
          <View style={styles.liveDataLabelBox}>
            <Text style={styles.liveDataLabelText}>{title}</Text>
          </View>
          {nextTime !== "Unavailable" ?
            <Text style={styles.liveData3}>{nextTime}</Text>
            : <Text style={styles.liveDataUnavailable}>Unavailable</Text>
          }
        </View>
    );
    if (price !== undefined) {
      getDivider();
      elements.push(<View style={styles.liveDataBox}>
          <View style={styles.liveDataLabelBox}>
            <Text style={styles.liveDataLabelText}>Price:</Text>
          </View>
          <Text style={styles.liveData3}>{price}</Text>
        </View>
      );
    }
  }

  function getDivider() {
    elements.push(<></>);
  }

  // If only standby or status: use center
  // If standby and reservation time: use Left and Right
  // If boarding group and reservation time: use Left and Right
  // If standby, single rider, and reservation time: Left, Center, Right

  switch (attr.queue.queueType) {
    case QueueType.open_status:
      statusElement();
      break;
    case QueueType.standby:
      standbyElement();
      break;
    case QueueType.standby_reservation:
      standbyElement();
      getDivider();
      reservationTimeElement();
      break;
    case QueueType.boarding_reservation:
      boardingGroupElement();
      getDivider();
      reservationTimeElement();
      break;
    case QueueType.standby_single_reservation:
      standbyElement();
      getDivider();
      singleRiderElement();
      getDivider();
      reservationTimeElement();
      break;
    case QueueType.standby_single:
      standbyElement();
      getDivider();
      singleRiderElement();
      break;
    case QueueType.undetermined:
      break;
    default:
      break;
  }

  return (
    <View style={styles.attractionLiveDataView}>
      {Object.values(elements).map((element, index) => {
        if (index % 2 === 1) {
          return <View key={index} style={styles.liveDataDivider} />
        } else {
          return (
            <View style={styles.liveDataBox} key={index}>{element}</View>
          )
        }})
      }
    </View>
  )
}

export default LiveDataComponent;