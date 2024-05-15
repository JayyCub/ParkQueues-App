import {Dimensions, DimensionValue, Platform, StyleSheet} from "react-native";

export const fontFamily = "Avenir";

export const colorPalette = {
  layer00: "#010217",
  layer0: "#031325",
  layer1: "#0A2647",
  layer2: "#144272",
  layer3: "#205295",
  layer3b: "#105cbc",
  layer3c: "#08dcdc",
  layer4: "#2C74B3",
  layer5: "#4693d7",
  layer6: "#62a8e6",
  layer7: "#85bff3",
  layer8: "#a0ccf4",
  layer9: "#c0dcf6",
  layer9b: "#8295a5",
  layer10: "#dbeaf8",
  layer11: "#f0f8fd",
  layer12: "#f7ffff",
  layer13: "#ffffff", // white
  layer14: "#fbfbfb",
  layer15: "#eef0fb", // off-white
}

export interface PlatformStyles {
  statusBar: {
    height: string,
    bgColor: string,
    fontColor: string,
    fontSize?: number,
    fontFamily: string,
  },

  mainContainer: {
    bgColor: string,
  },

  destCard: {
    width: string,
    bgColor: string,
    fontColor: string,
  }

  parkCard: {
    bgColor: string,
  }
}

const iosStyles: PlatformStyles = {
  destCard: {
    width: "90%",
    bgColor: colorPalette.layer13,
    fontColor: colorPalette.layer00,
  },
  mainContainer: {bgColor: colorPalette.layer15},
  statusBar: {
    bgColor: colorPalette.layer14,
    height: "50",
    fontColor: colorPalette.layer2,
    fontSize: 30,
    fontFamily: fontFamily,
  },
  parkCard: {bgColor: colorPalette.layer4}
}

const webStyles: PlatformStyles = {
  destCard: {
    width: "90%",
    bgColor: colorPalette.layer13,
    fontColor: colorPalette.layer00,
  },
  mainContainer: {bgColor: colorPalette.layer15},
  statusBar: {
    bgColor: colorPalette.layer14,
    height: "50",
    fontColor: colorPalette.layer2,
    fontSize: 30,
    fontFamily: fontFamily,
  },
  parkCard: {bgColor: colorPalette.layer4}
}

const platform = Platform.OS;
export const platform_style: PlatformStyles = platform === 'ios' ? iosStyles : webStyles;

export const styles = StyleSheet.create({
  subheaderView: {
    backgroundColor: platform_style.statusBar.bgColor,
    paddingBottom: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderColor: "lightgray",
  },
  toolsHeaderView: {
    backgroundColor: colorPalette.layer13,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderColor: "lightgray",
  },
  subheaderText: {
    fontSize: 20,
    // fontWeight: "bold",
    fontStyle: "italic",
    textAlign: "center",
    color: platform_style.statusBar.fontColor,
    fontFamily: fontFamily,
  },
  subheaderShowDataTrue: {
    padding: 5,
    backgroundColor: colorPalette.layer3c,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  subheaderShowDataFalse: {
    padding: 5,
    backgroundColor: colorPalette.layer9b,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  webStatusBar: {
    height: 50,
    width: '100%',
    backgroundColor: platform_style.statusBar.bgColor,
  },
  main: {
    flex: 1,
    alignItems: 'center',
    borderStyle: 'solid',
    paddingBottom: 50,
  },
  destinationCard: {
    width: platform_style.destCard.width as DimensionValue,
    backgroundColor: platform_style.destCard.bgColor,
    marginTop: 20,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    shadowColor: "#aeb5be",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  parkCard: {
    width: platform_style.destCard.width as DimensionValue,
    backgroundColor: platform_style.destCard.bgColor,
    marginTop: 20,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    shadowColor: "#aeb5be",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  destinationTitle: {
    color: platform_style.destCard.fontColor,
    fontSize: 24,
    fontFamily: fontFamily,
  },
  attractionCard: {
    width: '96%',
    backgroundColor: platform_style.destCard.bgColor,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 0,
    marginTop: 8,
    alignItems: "center",
    borderRadius: 8,
    shadowColor: "#aeb5be",
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  attractionTitle: {
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 5,
    width: '100%',
    justifyContent: "center",
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderColor: "lightgray",
  },
  attractionTitleText: {
    color: "#133ca2",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: fontFamily,
  },
  attractionWait: {
    backgroundColor: colorPalette.layer14,
  },
  attractionWaitText: {
    color: platform_style.destCard.fontColor,
    fontSize: 30,
    fontFamily: fontFamily,
  },
  attractionLiveDataView: {
    width: '100%',
    flexDirection: "row",
    paddingTop: 2,
    paddingBottom: 2,
  },
  liveDataBox: {
    flex: 1,
    justifyContent: "center",
    fontSize: 12,
    fontFamily: fontFamily,
  },
  liveDataLabelBox: {
  },
  liveDataLabelText: {
    textAlign: "center",
    fontStyle: "italic",
    fontFamily: fontFamily,
  },
  liveData2: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: fontFamily,
  },
  liveData3: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: fontFamily,
  },
  liveDataUnavailable: {
    fontSize: 20,
    textAlign: "center",
    fontStyle: "italic",
    fontFamily: fontFamily,
  },
  liveDataDivider: {
    width: 1,
    backgroundColor: "lightgray",
  },
  attractionLiveDataCard: {
    width: '96%',
    backgroundColor: platform_style.destCard.bgColor,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 0,
    marginTop: 8,
    alignItems: "center",
    borderRadius: 5,
    shadowColor: "#aeb5be",
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  attractionPageHeaderText: {
    fontSize: 20,
    fontFamily: fontFamily,
  },
  attractionLiveText: {
    fontSize: 20,
    fontFamily: fontFamily,
    color: "red",
  },
  searchBar: {
    backgroundColor: colorPalette.layer13,
    height: 40,
    borderColor: colorPalette.layer9b,
    borderRadius: 25,
    borderWidth: 2.5,
    paddingHorizontal: 10,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 18,
  },
  searchBarSelected: {
    backgroundColor: colorPalette.layer13,
    height: 40,
    borderColor: colorPalette.layer3b,
    borderRadius: 25,
    borderWidth: 2.5,
    paddingHorizontal: 10,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 18,
  },
  subheaderSortAlphaDesc: {
    backgroundColor: colorPalette.layer9b,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  subheaderSortAlphaAsc: {
    backgroundColor: colorPalette.layer7,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  attrAvailSectionText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: platform_style.statusBar.fontColor,
    fontFamily: fontFamily,
  },
  attrAvailSectionView: {
    width: "92%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    borderStyle: "solid",
    borderBottomWidth: 2,
    borderColor: platform_style.statusBar.fontColor,
  }
});
