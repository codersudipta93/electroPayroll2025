import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '../../Constants/Theme/Theme';
import { FontFamily, FontSize } from '../../Constants/Fonts';
import { windowHeight, windowWidth } from '../../Constants/window';


// create a component
const Styles = () => {
  const { colorTheme } = useTheme();
  return StyleSheet.create({
    // container: {
    //   flex: 1,
    //   justifyContent: 'flex-start',
    //   alignItems: 'flex-start',
    //   flexDirection: 'column',
    //   backgroundColor: colorTheme.headerColor,
    //   //backgroundColor: "#051121",
    //   height: windowHeight,
    // },
    // containerWrapper: {
    //   width: windowWidth,
    //   justifyContent: 'flex-start',
    //   alignItems: 'flex-start',
    //   flexDirection: 'column',
    //   backgroundColor: colorTheme.whiteColor,
    //   borderTopLeftRadius: 12,
    //   borderTopRightRadius: 12,
    //   height: windowHeight,
    // },
    // ProfileCard: {
    //   width: "100%",
    //   flexDirection: 'column',
    //   justifyContent: 'center',
    //   alignItems: 'center',
    //   marginTop: 10,
    //   //marginBottom: 8,
    //   //marginLeft: 6,
    //   // backgroundColor: colorTheme.buttonBackgroundColor,
    // },
    // profileImage: {
    //   height: 70,
    //   width: 70,
    //   borderRadius: 6
    // },
    // userDetails: {
    //   flexDirection: 'column',
    //   justifyContent: 'center',
    //   alignItems: 'center',
    //   marginTop: 5,
    // },
    // userName: {
    //   fontSize: FontSize.f14,
    //   // marginTop: 6,
    //   color: colorTheme.blackColor,
    //   textTransform: 'uppercase',
    //   fontFamily: FontFamily.medium
    // },
    // officeTime: {
    //   color: colorTheme.buttonTextColor,
    //   fontSize: FontSize.f11,
    //   fontFamily: FontFamily.medium,
    //   //textTransform: 'uppercase',
    // },
    // empIdLabel: {
    //   marginTop: 2,
    //   backgroundColor: colorTheme.shadeDark,
    //   padding: 2,
    //   paddingHorizontal: 8,
    //   borderRadius: 12
    // },
    // headingWrapper:{ width: '95%', justifyContent: "space-between", alignItems: 'center', flexDirection: 'row', marginLeft: 12, marginTop: 35 },
    // heading:{ fontSize: FontSize.f15, color: colorTheme.blackColor, fontFamily: FontFamily.bold },
    // editProfileLabel:{ color: colorTheme.lightBlue, fontSize: FontSize.f14, marginRight: 12, fontFamily: FontFamily.medium },
    
    // profileDetailsKeyRow:{width: '90%', justifyContent: "space-between", alignItems: 'flex-start', flexDirection: 'row', marginLeft: 12, marginTop: 12 },
    // leftKeyWrapper:{ width: '70%' },
    // leftKey:{ fontSize: FontSize.f12, textTransform: 'uppercase', color: colorTheme.shadeMedium, fontFamily: FontFamily.regular },

    // rightKeyWrapper:{ width: '30%' },
    // rightKey:{ color: colorTheme.shadeMedium, fontSize: FontSize.f12, textTransform: 'uppercase', },

    // profileDetailsValueRow:{ width: '90%', justifyContent: "space-between", alignItems: 'flex-start', flexDirection: 'row', marginLeft: 12, marginTop:2 },
    // leftValueWrapper:{ width: '70%' },
    // leftValue:{ fontSize: FontSize.f13, color: colorTheme.blackColor, fontFamily: FontFamily.regular },
    // rightValueWrapper:{ width: '30%' },
    // rightValue:{ textAlign: 'left', color: colorTheme.blackColor, fontSize: FontSize.f13 }

    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    listItem: { paddingHorizontal: 8, paddingVertical: 6, marginLeft: 12, borderRadius: 4 },
    itemText: { fontSize: 12 },
    detailsCardMain: { width: '100%', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    detailsCardWrapper: { backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 18, paddingTop: 4, width: '95%', backgroundColor: '#fff', elevation: 5 },
    headingMain: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' },
    headerBullet: { width: 12, height: 12, borderRadius: 7.5, backgroundColor:colorTheme.headerColor },
    headerTitle: { fontSize: 14, color: colorTheme.headerColor, fontFamily:FontFamily.bold,marginVertical: 10, marginLeft: 4, textTransform:'uppercase' },
    key: { fontSize: 13, fontFamily:FontFamily.medium, marginTop: 10, color:colorTheme.headerColor },
    value: { fontSize: 14, marginTop: 6, fontFamily:FontFamily.bold, marginBottom:10},
    modalBackground: {
      flex: 1,
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'space-around',
      backgroundColor: '#rgba(0, 0, 0, 0.5)',
     // zIndex: 1000
    },
    activityIndicatorWrapper: {
      backgroundColor: '#FFFFFF',
      height: 40,
      width: 40,
      borderRadius: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around'
    }
  });
};
export default Styles;
