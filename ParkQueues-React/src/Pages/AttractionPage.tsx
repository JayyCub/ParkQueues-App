import {Attraction, HistoryData} from "../Data/Attraction";
import {styles} from "../styles/styles";
import {Platform, ScrollView, Text, View} from "react-native";
import React, {useState} from "react";
import LiveDataComponent from "../Components/LiveDataComponent";
import {QueueType} from "../Data/Queue";
import SingleLineAreaChart from "../Components/SingleLineAreaChart";
import TwoLineAreaChart from "../Components/TwoLineAreaChart";
import WebSingleLineAreaChart from "../Components/WebSingleLineAreaChart";

const AttractionPage = ({ route }: any) => {
  const [attr] = useState<Attraction>(route.params?.attr);

  let historicStandby: {
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
        // reservationTimeElement();
        break;
      case QueueType.standby_single:
        // standbyElement();
        historicStandby.push({
          high: getStandby(value),
          date: new Date(value.time).getTime(),
        })

        // singleRiderElement();
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
        break;
      default:
        historicStandby.push({
          high: -8,
          date: new Date(value.time).getTime(),
        })
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
              <View style={{width: '100%', height: "auto"}}>
                {historicStandby.length > 0 ?
                  <View style={{width: '100%', height: "auto"}}>
                    <View style={styles.attractionTitle}>
                      <Text style={styles.attractionPageHeaderText}>Standby Wait History:</Text>
                    </View>
                    <WebSingleLineAreaChart data={historicStandby} timezone={route.params.timezone}/>
                  </View>
                  : null}
{/*
                {historicBoardingGroup.length > 0 ?
                  <View style={{width: '100%', height: "auto"}}>
                    <View style={styles.attractionTitle}>
                      <Text style={styles.attractionPageHeaderText}>Boarding Group History:</Text>
                    </View>
                    <TwoLineAreaChart data={historicBoardingGroup} timezone={route.params.timezone}/>
                  </View>
                  : null}
*/}
              </View>
{/*
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
*/}
            </View>
            :
            <View style={styles.attractionLiveDataCard}>
              <View style={{width: '100%', height: "auto"}}>
                {historicStandby.length > 0 ?
                  <View style={{width: '100%', height: "auto"}}>
                    <View style={styles.attractionTitle}>
                      <Text style={styles.attractionPageHeaderText}>Standby Wait History:</Text>
                    </View>
                    <SingleLineAreaChart data={historicStandby} timezone={route.params.timezone}/>
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
          }
        </View>
      </ScrollView>
    </>
  )
}

export default AttractionPage;