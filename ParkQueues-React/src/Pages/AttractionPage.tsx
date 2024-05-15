import {Attraction, HistoryData} from "../Data/Attraction";
import {styles} from "../styles/styles";
import {Platform, ScrollView, Text, View} from "react-native";
import React, {useState} from "react";
import LiveDataComponent from "../Components/LiveDataComponent";
import {QueueType} from "../Data/Queue";
import SingleLineAreaChart from "../Components/SingleLineAreaChart";
import TwoLineAreaChart from "../Components/TwoLineAreaChart";

const AttractionPage = ({ route }: any) => {
  const [attr] = useState<Attraction>(route.params?.attr);

  let historicStandby: {
    high: number | undefined,
    date: number,
  }[] = [];

  let historicSingleRider: {
    high: number | undefined,
    date: number,
  }[] = [];

  let historicStatus: {
    high: number | undefined,
    date: number,
  }[] = [];


  let historicBoardingGroup: {
    start: number | undefined,
    end: number | undefined,
    date: number,
  }[] = [];

  function getStandby(val: HistoryData) {
    if (val.queue.STANDBY !== undefined) {
      if (val.queue.STANDBY.waitTime !== null) {
        return val.queue.STANDBY.waitTime;
      } else {
        return 1;
      }
    } else {
      return -1;
    }
  }

  function getSingleRider(val: HistoryData) {
    if (val.queue.SINGLE_RIDER !== undefined) {
      if (val.queue.SINGLE_RIDER.waitTime !== null) {
        return val.queue.SINGLE_RIDER.waitTime;
      } else {
        return 0.01;
      }
    } else {
      return -1;
    }
  }

  attr.history.forEach((value) => {
    switch (value.queue.queueType) {
      case QueueType.open_status:
        // statusElement();
        historicStandby.push({
          high: 1,
          date: new Date(value.time).getTime(),
        });
        break;
      case QueueType.standby:
        // standbyElement();
        historicStandby.push({
          high: getStandby(value),
          date: new Date(value.time).getTime(),
        });
        break;
      case QueueType.standby_reservation:
        // standbyElement();
        // reservationTimeElement();
        historicStandby.push({
          high: getStandby(value),
          date: new Date(value.time).getTime(),
        });
        break;
      case QueueType.boarding_reservation:
        let start;
        let end;
        if (typeof value.queue.BOARDING_GROUP?.currentGroupStart === "number" &&
            typeof value.queue.BOARDING_GROUP?.currentGroupEnd === "number") {
          start = value.queue.BOARDING_GROUP.currentGroupStart;
          end = value.queue.BOARDING_GROUP.currentGroupEnd;
        }


        // boardingGroupElement();
        historicBoardingGroup.push({
          start: start,
          end: end,
          date: new Date(value.time).getTime(),
        })
        // reservationTimeElement();
        break;
      case QueueType.standby_single_reservation:
        // standbyElement();
        historicStandby.push({
          high: getStandby(value),
          date: new Date(value.time).getTime(),
        });
        // singleRiderElement();
        historicSingleRider.push({
          high: getSingleRider(value),
          date: new Date(value.time).getTime(),
        });
        // reservationTimeElement();
        break;
      case QueueType.standby_single:
        // standbyElement();
        historicStandby.push({
          high: getStandby(value),
          date: new Date(value.time).getTime(),
        })

        // singleRiderElement();
        historicSingleRider.push({
          high: getSingleRider(value),
          date: new Date(value.time).getTime(),
        });
        break;
      case QueueType.undetermined:
        historicStandby.push({
          high: -6,
          date: new Date(value.time).getTime(),
        })
        break;
      case QueueType.closed:
        historicStandby.push({
          high: undefined,
          date: new Date(value.time).getTime(),
        });
        historicSingleRider.push({
          high: undefined,
          date: new Date(value.time).getTime(),
        });
        historicBoardingGroup.push({
          start: undefined,
          end: undefined,
          date: new Date(value.time).getTime(),
        });
        break;
      default:
        // historicStandby.push({
        //   high: -8,
        //   date: new Date(value.time).getTime(),
        // })
        break;
    }
  });

  return (
    <>
      <View style={styles.subheaderView}>
        <Text
          style={styles.subheaderText}
        >{attr.name}</Text>
      </View>
      <ScrollView>
        <View style={styles.main}>
          <View style={styles.attractionLiveDataCard}>
            <View style={styles.attractionTitle}>
              <Text style={styles.attractionLiveText}>Live:</Text>
            </View>
            <LiveDataComponent attr={attr} timezone={route.params.timezone} showAdditionalText={false} />
          </View>
          {Platform.OS === 'web' ?
            <View style={styles.attractionLiveDataCard}>
              {/*<View style={{width: '100%', height: "auto"}}>
                {(attr.queue.queueType === QueueType.standby
                  || attr.queue.queueType === QueueType.standby_single
                  || attr.queue.queueType === QueueType.standby_single_reservation
                  || attr.queue.queueType === QueueType.open_status) ?
                  <View style={{width: '100%', height: "auto"}}>
                    <View style={styles.attractionTitle}>
                      <Text style={styles.attractionPageHeaderText}>Standby Wait History:</Text>
                    </View>
                    <WebSingleLineAreaChart data={historicStandby} timezone={route.params.timezone}/>
                  </View>
                  : null}
                {(attr.queue.queueType === QueueType.standby_single
                  || attr.queue.queueType === QueueType.standby_single_reservation) ?
                  <View style={{width: '100%', height: "auto"}}>
                    <View style={styles.attractionTitle}>
                      <Text style={styles.attractionPageHeaderText}>Single Rider Wait History:</Text>
                    </View>
                    <WebSingleLineAreaChart data={historicSingleRider} timezone={route.params.timezone}/>
                  </View>
                  : null}
                {historicBoardingGroup.length > 0 ?
                  <View style={{width: '100%', height: "auto"}}>
                    <View style={styles.attractionTitle}>
                      <Text style={styles.attractionPageHeaderText}>Boarding Group History:</Text>
                    </View>
                    <TwoLineAreaChart data={historicBoardingGroup} timezone={route.params.timezone}/>
                  </View>
                  : null}
              </View>*/}
            </View>
            :
            <>
              {(attr.queue.queueType === QueueType.standby
                || attr.queue.queueType === QueueType.standby_single
                || attr.queue.queueType === QueueType.standby_single_reservation
                || attr.queue.queueType === QueueType.open_status
                || attr.queue.queueType === QueueType.standby_reservation) ?
                <View style={styles.attractionLiveDataCard}>
                  <View style={{width: '100%', height: "auto"}}>
                    <View style={styles.attractionTitle}>
                      <Text style={styles.attractionPageHeaderText}>Standby Wait History:</Text>
                    </View>
                    <SingleLineAreaChart data={historicStandby} timezone={route.params.timezone}/>
                  </View>
                  <View style={{flexDirection: "row", marginBottom: 5}}>
                    <View style={{
                      width: '50%',
                      paddingLeft: 2,
                    }}>

                      <Text>6 hours ago</Text>
                    </View>
                    <View style={{
                      width: '50%',
                      paddingRight: 2,
                      alignItems: "flex-end",
                    }}>
                      <Text>Now</Text>
                    </View>
                  </View>
                </View>
                : null}
              {(attr.queue.queueType === QueueType.standby_single
                || attr.queue.queueType === QueueType.standby_single_reservation) ?
                <View style={styles.attractionLiveDataCard}>
                  <View style={{width: '100%', height: "auto"}}>
                    <View style={styles.attractionTitle}>
                      <Text style={styles.attractionPageHeaderText}>Single Rider Wait History:</Text>
                    </View>
                    <SingleLineAreaChart data={historicSingleRider} timezone={route.params.timezone}/>
                  </View>
                  <View style={{flexDirection: "row", marginBottom: 5}}>
                    <View style={{
                      width: '50%',
                      paddingLeft: 2,
                    }}>

                      <Text>6 hours ago</Text>
                    </View>
                    <View style={{
                      width: '50%',
                      paddingRight: 2,
                      alignItems: "flex-end",
                    }}>
                      <Text>Now</Text>
                    </View>
                  </View>
                </View>
                : null}
              {(attr.queue.queueType === QueueType.boarding_reservation) ?
                <View style={styles.attractionLiveDataCard}>
                  <View style={{width: '100%', height: "auto"}}>
                    <View style={styles.attractionTitle}>
                      <Text style={styles.attractionPageHeaderText}>Boarding Group History:</Text>
                    </View>
                    <TwoLineAreaChart data={historicBoardingGroup} timezone={route.params.timezone}/>
                  </View>
                  <View style={{flexDirection: "row", marginBottom: 5}}>
                    <View style={{
                      width: '50%',
                      paddingLeft: 2,
                    }}>

                      <Text>6 hours ago</Text>
                    </View>
                    <View style={{
                      width: '50%',
                      paddingRight: 2,
                      alignItems: "flex-end",
                    }}>
                      <Text>Now</Text>
                    </View>
                  </View>
                </View>
                : null}
            </>
          }
        </View>
      </ScrollView>
    </>
  )
}

export default AttractionPage;