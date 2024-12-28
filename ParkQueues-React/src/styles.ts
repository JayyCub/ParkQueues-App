import { type DimensionValue, Platform, StyleSheet } from 'react-native'

export const fontFamily = 'Avenir'

export const colorPalette = {
  layer00: '#010217',
  layer0: '#031325',
  layer1: '#0A2647',
  layer2: '#144272',
  layer3: '#205295',
  layer3b: '#105cbc',
  layer3c: '#37d8d8',
  layer4: '#2C74B3',
  layer5: '#4693d7',
  layer6: '#62a8e6',
  layer7: '#85bff3',
  layer8: '#a0ccf4',
  layer9: '#c0dcf6',
  layer9b: '#8295a5',
  layer10: '#dbeaf8',
  layer11: '#f0f8fd',
  layer12: '#f7ffff',
  layer13: '#ffffff', // white
  layer13b: '#f4f4f4', // white-blue
  layer14: '#fbfbfb',
  layer15: '#f3f4fb' // off-white
}

export interface PlatformStyles {
  statusBar: {
    height: string
    bgColor: string
    fontColor: string
    fontSize?: number
    fontFamily: string
  }

  mainContainer: {
    bgColor: string
  }

  destCard: {
    width: string
    bgColor: string
    fontColor: string
  }

  parkCard: {
    bgColor: string
  }
}

const iosStyles: PlatformStyles = {
  destCard: {
    width: '90%',
    bgColor: colorPalette.layer13,
    fontColor: colorPalette.layer00
  },
  mainContainer: { bgColor: colorPalette.layer15 },
  statusBar: {
    bgColor: colorPalette.layer13,
    height: '50',
    fontColor: colorPalette.layer2,
    fontSize: 26,
    fontFamily
  },
  parkCard: { bgColor: colorPalette.layer4 }
}

const webStyles: PlatformStyles = {
  destCard: {
    width: '90%',
    bgColor: colorPalette.layer13,
    fontColor: colorPalette.layer00
  },
  mainContainer: { bgColor: colorPalette.layer15 },
  statusBar: {
    bgColor: colorPalette.layer13,
    height: '50',
    fontColor: colorPalette.layer2,
    fontSize: 26,
    fontFamily
  },
  parkCard: { bgColor: colorPalette.layer4 }
}

const platform = Platform.OS
export const platformStyle: PlatformStyles = platform === 'ios' ? iosStyles : webStyles

export const styles = StyleSheet.create({
  subheaderView: {
    backgroundColor: platformStyle.statusBar.bgColor,
    paddingBottom: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
    // borderStyle: 'solid',
    // borderBottomWidth: 0,
    // borderColor: 'lightgray',
  },
  toolsHeaderView: {
    backgroundColor: colorPalette.layer13,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: 'lightgray'
  },
  subheaderText: {
    fontSize: 22,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center',
    color: platformStyle.statusBar.fontColor,
    fontFamily
  },
  subheaderShowDataTrue: {
    padding: 5,
    backgroundColor: colorPalette.layer3c,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  subheaderShowDataFalse: {
    padding: 5,
    backgroundColor: colorPalette.layer9b,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  webStatusBar: {
    height: 50,
    width: '100%',
    backgroundColor: platformStyle.statusBar.bgColor
  },
  main: {
    flex: 1,
    alignItems: 'center',
    borderStyle: 'solid',
    paddingBottom: 50
  },
  destinationCard: {
    width: platformStyle.destCard.width as DimensionValue,
    backgroundColor: platformStyle.destCard.bgColor,
    marginTop: 12,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    shadowColor: '#aeb5be',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 1,
    zIndex: 999,
    borderColor: '#ffffff',
    borderWidth: 2,
    borderStyle: 'solid'
  },
  destinationCardSelected: {
    // backgroundColor: '#dbf0ff',
    // shadowColor: '#aecaec',
    shadowOffset: { width: 0, height: 2 },
    borderColor: '#0033b3',
    borderWidth: 2.5,
    borderStyle: 'solid'
  },
  shadowWrapper: {
    // marginTop: -30,
    // paddingTop: 30,
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#aeb5be',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderColor: '#0033b3',
    borderWidth: 2,
    borderTopWidth: 0,
    borderStyle: 'solid'
  },
  expandedParkList: {
    width: '100%',
    // marginTop: -30,
    // paddingTop: 30,
    // paddingBottom: 5,
    // backgroundColor: '#e4effd',
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  parkListCard: {
    borderTopWidth: 1,
    borderTopColor: 'lightgray'
  },
  parkListCardFirst: {
    width: '88%',
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center'
  },
  parkListCardText: {
    textAlign: 'center',
    color: '#00204d',
    fontSize: 20,
    overflow: 'scroll',
    fontWeight: '400',
    fontFamily
  },
  parkCard: {
    width: platformStyle.destCard.width as DimensionValue,
    backgroundColor: platformStyle.destCard.bgColor,
    marginTop: 20,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    shadowColor: '#aeb5be',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 1
  },
  destinationTitle: {
    color: '#00204d',
    fontSize: 22,
    fontFamily,
    fontWeight: '400'
  },
  attractionCard: {
    width: '96%',
    backgroundColor: platformStyle.destCard.bgColor,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 0,
    marginTop: 10,
    alignItems: 'center',
    borderRadius: 8,
    shadowColor: '#aeb5be',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 1
  },
  attractionTitle: {
    flexDirection: 'row',
    paddingVertical: 3,
    marginBottom: 3,
    width: '100%',
    // justifyContent: 'center',
    borderStyle: 'solid',
    borderBottomWidth: 1.25,
    borderColor: 'lightgray'
  },
  attractionTitleText: {
    color: colorPalette.layer3b,
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily,
    // backgroundColor: 'gray',
    width: '92%',
    paddingTop: 2
  },
  attractionWait: {
    backgroundColor: colorPalette.layer14
  },
  attractionWaitText: {
    color: platformStyle.destCard.fontColor,
    fontSize: 30,
    fontFamily
  },
  attractionLiveDataView: {
    width: '100%',
    flexDirection: 'row'
    // paddingTop: 2,
    // paddingBottom: 2
  },
  liveDataBox: {
    flex: 1,
    justifyContent: 'center',
    fontSize: 12,
    fontFamily
  },
  liveDataLabelBox: {
  },
  liveDataLabelText: {
    textAlign: 'center',
    fontStyle: 'italic',
    fontFamily
  },
  liveData2: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily
  },
  liveData3: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily
  },
  liveDataUnavailable: {
    fontSize: 20,
    textAlign: 'center',
    // fontStyle: 'italic',
    // fontWeight: 'bold',
    fontFamily
  },
  liveDataDivider: {
    width: 1,
    backgroundColor: 'lightgray'
  },
  attractionLiveDataCard: {
    width: '96%',
    backgroundColor: platformStyle.destCard.bgColor,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 0,
    marginTop: 8,
    alignItems: 'center',
    borderRadius: 5,
    shadowColor: '#aeb5be',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 1
  },
  attractionPageHeaderText: {
    fontSize: 20,
    fontFamily,
    fontWeight: '600',
    width: '92%'
  },
  attractionLiveText: {
    fontSize: 20,
    fontFamily,
    color: 'red',
    fontWeight: '600'
  },
  searchBar: {
    backgroundColor: colorPalette.layer13,
    height: 40,
    borderColor: colorPalette.layer9b,
    borderRadius: 25,
    borderWidth: 2,
    paddingHorizontal: 10,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 18
  },
  searchBarSelected: {
    backgroundColor: colorPalette.layer13,
    height: 40,
    borderColor: colorPalette.layer3b,
    borderRadius: 25,
    borderWidth: 2,
    paddingHorizontal: 10,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 18
  },
  subheaderSortAlphaDesc: {
    width: 40,
    height: 40,
    backgroundColor: colorPalette.layer9b,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  subheaderSortAlphaAsc: {
    width: 40,
    height: 40,
    backgroundColor: colorPalette.layer7,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  attrAvailSectionText: {
    width: '95%',
    fontSize: 30,
    fontWeight: 'bold',
    color: platformStyle.statusBar.fontColor,
    fontFamily
  },
  attrAvailSectionView: {
    width: '92%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderStyle: 'solid',
    borderBottomWidth: 2,
    borderColor: platformStyle.statusBar.fontColor
  },
  destinationSectionView: {
    width: '92%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    // marginBottom: 10,
    borderStyle: 'solid',
    borderBottomWidth: 2,
    borderColor: platformStyle.statusBar.fontColor
  },
  destinationSectionView2: {
    width: '92%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5
  },
  attrAvailSectionText2: {
    width: '95%',
    textAlign: 'left',
    fontSize: 16,
    // fontWeight: 'bold',
    color: platformStyle.statusBar.fontColor,
    fontFamily
  },
  authContainer: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    height: '100%'
  },
  authCard: {
    // width: platformStyle.destCard.width as DimensionValue,
    width: '100%',
    backgroundColor: platformStyle.destCard.bgColor,
    // marginTop: 12,
    padding: 15,
    paddingTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25
    // shadowColor: '#aeb5be',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 1,
    // shadowRadius: 2,
    // flexGrow: 1,
  },
  authHeadingText: {
    fontFamily,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: colorPalette.layer1
  },
  authInput: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 5,
    fontSize: 18,
    backgroundColor: colorPalette.layer14
  },
  authButton: {
    height: 40,
    width: '90%',
    backgroundColor: 'gray',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16
  },
  authButtonReady: {
    height: 40,
    width: '90%',
    backgroundColor: '#136f00',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16
  },
  authButtonText: {
    fontFamily,
    fontSize: 20,
    fontWeight: '600',
    color: colorPalette.layer13
  },
  authButtonReadyText: {
    fontFamily,
    fontSize: 20,
    fontWeight: '600',
    color: colorPalette.layer13
  },
  authFieldText: {
    fontFamily,
    fontSize: 15,
    color: colorPalette.layer1,
    width: '85%'
  },
  accountSectionView: {
    width: '92%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    // marginBottom: 10,
    borderStyle: 'solid',
    borderBottomWidth: 2,
    borderColor: platformStyle.statusBar.fontColor
  },
  accountHeaderText: {
    width: '95%',
    fontSize: 32,
    fontWeight: 'bold',
    color: platformStyle.statusBar.fontColor,
    fontFamily
  },
  accountSubHeaderText: {
    width: '88%',
    fontSize: 18,
    // fontWeight: 'bold',
    color: platformStyle.statusBar.fontColor,
    fontFamily,
    marginTop: 8
  },
  signOutButton: {
    height: 40,
    width: '90%',
    backgroundColor: colorPalette.layer14,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
    shadowColor: '#aeb5be',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 1
  },
  signOutButtonText: {
    fontFamily,
    fontSize: 20,
    fontWeight: '600'
    // color: platformStyle.statusBar.fontColor
  },
  invalidPassword: {
    borderColor: '#d30000'
  },
  validField: {
    borderColor: '#136f00'
  },
  authInputField: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
    paddingHorizontal: 8,
    backgroundColor: colorPalette.layer14,
    justifyContent: 'center'
  },
  authInputFieldText: {
    fontSize: 18
  },
  resetPasswordButton: {
    height: 32,
    width: '50%',
    // backgroundColor: 'lightgray',
    borderRadius: 5,
    borderColor: 'lightgray',
    // borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16
  },
  favAttrDest: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#4c91ea',
    paddingHorizontal: 10,
    paddingTop: 0,
    paddingBottom: 8,
    marginTop: 10,
    marginBottom: -18,
    // alignItems: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    shadowColor: '#aeb5be',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 1
  },
  favAttrParkText: {
    fontSize: 15,
    fontWeight: '600',
    color: colorPalette.layer13,
    fontFamily,
    letterSpacing: 0.25
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
    // marginTop: 22
  },
  destSelectButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: platformStyle.destCard.bgColor,
    // marginTop: 20,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    shadowColor: '#aeb5be',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 1,
    borderColor: '#ffffff',
    borderWidth: 2.5,
    borderStyle: 'solid'
  },
  destSelectButtonSelected: {
    borderColor: '#0033b3',
    borderWidth: 2.5,
    borderStyle: 'solid'
  },
  destSelectText: {
    color: '#00204d',
    fontFamily,
    fontSize: 24,
    fontWeight: '400'
  },
  homePageSubSection: {
    width: '89%',
    justifyContent: 'space-between', // Distributes space between text and icons
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 5,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: platformStyle.statusBar.fontColor,
    flexDirection: 'row'
  },
  homePageSubSectionText: {
    fontSize: 26,
    fontWeight: '700',
    color: platformStyle.statusBar.fontColor,
    fontFamily
    // Removes width constraint to allow it to float left
  },
  homePageSubSectionIcon: {
    flexDirection: 'row', // Align icons horizontally
    alignItems: 'center'
    // Removes width constraint to allow it to float right
  },
  closestDestinationCard: {
    width: platformStyle.destCard.width as DimensionValue,
    backgroundColor: platformStyle.destCard.bgColor,
    marginTop: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    shadowColor: '#aeb5be',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 1,
    zIndex: 999,
    borderColor: '#ffffff',
    borderWidth: 2,
    borderStyle: 'solid'
  },
  homePageSubSubSection: {
    flex: 1,
    alignItems: 'center',
    borderStyle: 'solid'
  },
  homePageSubSubSectionHeader: {
    width: '86%',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: 'gray'
    marginTop: 15,
    marginBottom: -2,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: platformStyle.statusBar.fontColor,
    flexDirection: 'row'
  },
  homePageSubSubSectionText: {
    // width: '100%',
    fontSize: 21,
    fontWeight: '500',
    color: platformStyle.statusBar.fontColor,
    fontFamily
    // borderStyle: 'solid',
    // borderBottomWidth: 5,
    // borderColor: platformStyle.statusBar.fontColor
  },
  nearbyAttrDest: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#4c91ea',
    paddingHorizontal: 10,
    paddingTop: 0,
    paddingBottom: 8,
    marginTop: 10,
    marginBottom: -18,
    // alignItems: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    shadowColor: '#aeb5be',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 1
  },
  destinationsBox: {
    paddingBottom: 5,
    width: '100%',
    overflow: 'hidden'
  },
  carouselSubtextBox: {
    width: '92%',
    justifyContent: 'center',
    alignItems: 'center'
    // marginTop: 5
  },
  carouselSubtext: {
    marginBottom: -8,
    width: '95%',
    textAlign: 'left',
    fontSize: 16,
    // fontWeight: 'bold',
    color: platformStyle.statusBar.fontColor,
    fontFamily
  },
  parkPageDivider: {
    width: '90%',
    marginTop: 15,
    // marginBottom: 5,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: platformStyle.statusBar.fontColor
  },
  filterButtonUnselected: {
    // height: 40,
    // width: 80,
    marginHorizontal: 5,
    backgroundColor: '#ffffff',
    borderColor: '#b7b7b7',
    borderWidth: 2,
    padding: 8,
    borderRadius: 20
  },
  filterButtonSelected: {
    // height: 40,
    // width: 80,
    marginHorizontal: 5,
    backgroundColor: '#ffffff',
    borderColor: '#00b0ff',
    borderWidth: 2,
    padding: 8,
    borderRadius: 20
  },
  filterButtonText: {
    fontWeight: 'bold',
    color: platformStyle.statusBar.fontColor,
    fontFamily,
    fontSize: 14
  },
  gestureHandler: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 3,
    backgroundColor: 'navy'
  },
  bottomSheetContent: {
    flex: 1,
    // padding: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomSheetMain: {
    flex: 1,
    alignItems: 'center',
    width: '100%'
    // paddingBottom: 50
  },
  parkPageMapContainer: {
    width: '90%',
    // height: 200,
    backgroundColor: 'white',
    borderRadius: 25,
    borderColor: '#ffffff',
    borderWidth: 2,
    padding: 5,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    shadowColor: '#aeb5be',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 1
  },
  mapMarker: {
    backgroundColor: 'white',
    paddingVertical: 0,
    paddingHorizontal: 8,
    minWidth: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2
  }
})
