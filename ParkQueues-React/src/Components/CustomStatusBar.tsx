// import {StatusBar} from "expo-status-bar";
// import {View, Text} from "react-native";
// import {styles} from "./styles/styles";
//
// export function CustomStatusBar(platform: string) {
//   if (platform === 'ios') {
//     return (
//       <View>
//         <StatusBar style="light"/>
//         <View style={styles.iosStatusBar}><Text style={styles.iosStatusBarTitle}>ParkQueues Mobile</Text></View>
//       </View>
//     );
//   } else if (platform === 'android') {
//     return (
//       <View>
//       </View>
//     );
//   } else {
//     return (
//       <View>
//       </View>
//     );
//   }
// }

import {View, Text} from 'react-native'
import React from 'react'
import {fontFamily, platform_style} from "../styles/styles";

const Header = (props: any) => {
  if (props.platform === 'ios') {
    return (
      <View>
        <Text style={{
          fontSize: platform_style.statusBar.fontSize,
          color: platform_style.statusBar.fontColor,
          fontFamily: fontFamily,
        }}>
          {props.title}</Text>
      </View>
    );
  } else if (props.platform === 'android') {
    return (
      <View>
        <Text style={{
          fontSize: platform_style.statusBar.fontSize,
          color: platform_style.statusBar.fontColor,
          fontFamily: fontFamily,
        }}>
          {props.title}</Text>
      </View>
    );
  } else if (props.platform === 'web') {
    return (
      <View>
        <Text style={{
          fontSize: platform_style.statusBar.fontSize,
          color: platform_style.statusBar.fontColor,
          fontFamily: fontFamily,
        }}>
          {props.title}</Text>
      </View>
    );
  } else {
    return (
      <>
      </>
    )
  }
}

export default Header