//import liraries
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { FontFamily, FontSize } from '../../Constants/Fonts';
import { useTheme } from '../../Constants/Theme/Theme';
import { windowHeight, windowWidth } from '../../Constants/window';


// create a component
const Styles = () => {
  const { colorTheme } = useTheme();
  return StyleSheet.create({
    container: {
      //flex: 1,
     // justifyContent: 'flex-start',
     // alignItems: 'flex-start',
      //flexDirection: 'column',
      //backgroundColor: colorTheme.buttonBackgroundColor,
      backgroundColor: colorTheme.headerColor,
    //  height: windowHeight,

    },
    profileImage: {
      height: 65,
      width: 65,
    },
    wishMsg:{
      fontSize: FontSize.f15,
      marginTop: 25,
      color: colorTheme.shadeMedium,
      fontFamily:FontFamily.medium,
      //textTransform:'uppercase'
      
    },
    userName: {
      fontSize: FontSize.f18,
      marginTop:6,
      color: colorTheme.headerColor,
      //textTransform: 'uppercase',
      fontFamily:FontFamily.bold,
      textTransform:'uppercase'
    },
    time: {
      color: colorTheme.headerColor,
      fontSize: FontSize.f13,
     // marginTop:4,
      fontFamily:FontFamily.medium,
      marginLeft:4,
      
    },
    ProfileCard: {
      width: "100%",
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      paddingHorizontal:25,
      paddingLeft:16,
      //marginTop: 10,
     // marginBottom: 12,
      height:130
      // backgroundColor: colorTheme.buttonBackgroundColor,
    },
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
    },
    menuCard:{
      width: windowWidth,
      height:windowHeight,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      flex: 1,
      backgroundColor: "#fff",
      flexDirection:'column',
      //paddingLeft:10
    },
    
    rightBox: {
      height: 110,
      justifyContent: 'center',
      alignItems:'center',
      borderRadius:12,
      marginBottom:15
    },
    cardIcon:{
      height: 30,
      width: 30
    },
    cardText:{
      fontSize:FontSize.f14,
      color:colorTheme.whiteColor,
      marginTop:8,
      fontFamily:FontFamily.medium
    },
    backgroundImageView: { width: '100%', height: '100%', objectFit:'cover' },
    overlay: {
    height: windowHeight,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: windowHeight / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loaderContainer: {
    padding: 4,
    //backgroundColor: 'white', 
   // borderRadius: 50,
   // elevation: 5, 
    //shadowColor: '#000', 
    //shadowOffset: { width: 0, height: 2 },
    //shadowOpacity: 0.2,
    //shadowRadius: 2,
  },
  });
};
export default Styles;
