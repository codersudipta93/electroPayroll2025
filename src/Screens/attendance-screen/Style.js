//import liraries
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '../../Constants/Theme/Theme';
import { FontFamily, FontSize } from '../../Constants/Fonts';
import { windowHeight, windowWidth } from '../../Constants/window';


// create a component
const Styles = () => {
  const { colorTheme } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      flexDirection: 'column',
      backgroundColor: colorTheme.headerColor,
      height: windowHeight,

    },
    ProfileCard: {
      width: "100%",
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 8,
      marginLeft: 6,
      paddingVertical: 8,
      //backgroundColor: colorTheme.buttonBackgroundColor,
    },
    profileImage: {
      height: 45,
      width: 45,
      borderRadius: 6
    },
    userDetails: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      marginLeft: 8,
      marginTop:4
    },
    userName: {
      fontSize: FontSize.f13,
      // marginTop: 6,
      color: colorTheme.buttonTextColor,
      textTransform: 'uppercase',
      fontFamily: FontFamily.medium
    },
    time: {
      color: colorTheme.buttonTextColor,
      fontSize: FontSize.f11,
      marginTop: 4,
      //fontFamily:FontFamily.regular
    },
    officeTime: {
      color: colorTheme.buttonTextColor,
      fontSize: FontSize.f11,
      //marginTop: 8,
      fontFamily: FontFamily.medium,
      //textTransform: 'uppercase',
    },

    attendenceMain: {
      marginTop: 6,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      width: windowWidth,
      padding: 6,
      marginBottom: 12
    },
    AttendenceLabel: {
      color: colorTheme.whiteColor,
      fontSize: FontSize.f11,
      fontFamily: FontFamily.bold,
      //textTransform: 'uppercase',
    },

    AttendenceTime: {
      color: colorTheme.whiteColor,
      fontSize: FontSize.f11,
      fontFamily: FontFamily.medium,
      marginLeft: 4,
    },
    timeoutTimeinMain: { flexDirection: 'row', marginLeft: 5, borderColor: colorTheme.shadeMedium, borderWidth: 1, borderRadius: 4, paddingHorizontal: 4, height: 28, width: "37%", justifyContent: 'center', alignItems: 'center' },
    attendenceBtnMain: { width: '50%', marginBottom: 20, justifyContent: 'center', alignItems: 'center' },
    attendenceBtn: { flexDirection: 'row', backgroundColor: colorTheme.sucessColor, borderRadius: 4, paddingHorizontal: 4, height: 35, width: "40%", justifyContent: 'center', alignItems: 'center' },
    buttonLabel: {
      color: colorTheme.buttonTextColor,
      fontSize: FontFamily.regular,
      fontSize: FontSize.f14
    },
    menuCard: {
      width: windowWidth,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      flex: 1,
      height: '100%',
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: "#fff",
      flexDirection: 'column',

    },
    boxContainer: {
      justifyContent: 'center',
      flexDirection: 'row',
      marginTop: 8
    },
    leftBox: {
      width: "45%",
      height: 110,
      paddingVertical: 8,
      paddingHorizontal: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colorTheme.shadeLight,
      borderRadius: 12,
      marginRight: 5,
    },
    rightBox: {
      width: "45%",
      height: 110,
      marginLeft: 5,
      paddingVertical: 8,
      paddingHorizontal: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colorTheme.shadeLight,
      borderRadius: 12
    },
    cardIcon: {
      height: 40,
      width: 40,
    },
    cardText: {
      fontSize: FontSize.f16,
      color: colorTheme.headerColor,
      marginTop: 4
    },
    listContainer: { margin: 8, marginVertical: 5, width: '95%' },
    listWrapper: { width: '100%', elevation: 6, borderColor: colorTheme.shadeMedium, borderWidth: 1, backgroundColor: colorTheme.whiteColor, padding: 6, borderRadius: 6 },
    listHeaderMian: { marginBottom: 8, flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', paddingHorizontal: 6, paddingBottom: 8, paddingVertical:12, borderBottomWidth: 1, borderColor: colorTheme.headerColor },
    headerTitle: { fontSize: FontSize.f15, fontFamily: FontFamily.bold, color: colorTheme.headerColor },
    dateContainer: { flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', },
    summaryDate: { marginLeft: 4, fontSize: FontSize.f13, fontFamily: FontFamily.bold, color: colorTheme.headerColor },
    lineItemMain: { flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', paddingHorizontal: 6, paddingBottom: 4 },
    itemKeyMain: { flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' },
    bullet: { width: 6, height: 3 },
    keyName: { marginLeft: 4, fontSize: FontSize.f13, fontFamily: FontFamily.medium, color: colorTheme.blackColor },
    keyValue: { fontSize: FontSize.f13, fontFamily: FontFamily.bold, color: colorTheme.blackColor },
    menuWrapper: { alignItems: 'center', justifyContent: 'center', flexDirection: 'row', backgroundColor: colorTheme.whiteColor, borderWidth: 1, borderColor: colorTheme.shadeMedium, padding: 6, width: '95%', marginTop: 8, borderRadius: 6, elevation: 6, marginBottom: 6 },



    toDateMain: { marginLeft: 15, borderRadius: 4, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', backgroundColor: "#dbe3f0", paddingHorizontal: 9, paddingVertical: 6, width: '40%' },
    toDateLabel: { marginLeft: 4, color: colorTheme.headerColor, fontSize: FontSize.f14, fontFamily: FontFamily.medium },
    fromDateMain: { marginLeft: 6, borderRadius: 4, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', backgroundColor: "#dbe3f0", paddingHorizontal: 9, paddingVertical: 4 },
    fromDate: { marginLeft: 4, color: colorTheme.headerColor, fontSize: FontSize.f14, fontFamily: FontFamily.medium },
    modalBackground: {
      flex: 1,
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'space-around',
      backgroundColor: '#rgba(0, 0, 0, 0.5)',
      zIndex: 1000
    },
    activityIndicatorWrapper: {
      backgroundColor: '#FFFFFF',
      height: 40,
      width: 40,
      borderRadius: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around'
    },
    optionModal: {
      backgroundColor: '#FFFFFF',
      padding: 12,
      width: '60%',
      borderRadius: 6,

    },

    searchWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      backgroundColor: colorTheme.whiteColor,
      borderWidth: 1,
      borderColor: colorTheme.shadeMedium,
      //padding: 6,
      paddingVertical: 14,
      paddingHorizontal:12,
      width: '95%',
      marginTop: 8,
      borderRadius: 6,
      elevation: 6,
      marginBottom: 12,
      marginTop:12,
    },
    dateInput: {
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: "#dbe3f0",
      paddingHorizontal: 9,
      paddingVertical: 10,
      width: '48.8%'
    },

  });
};
export default Styles;