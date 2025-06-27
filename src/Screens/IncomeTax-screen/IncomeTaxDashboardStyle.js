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
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      flexDirection: 'column',
      //backgroundColor: colorTheme.buttonBackgroundColor,
      backgroundColor: colorTheme.headerColor,
      height: windowHeight,
    },
    profileImage: { 
      height: 65,
      width: 65,
    },
    userName: {
      fontSize: FontSize.f15,
      marginTop: 6,
      color: colorTheme.buttonTextColor,
      textTransform: 'uppercase',
      fontFamily:FontFamily.bold
    },
    time: {
      color: colorTheme.buttonTextColor,
      fontSize: FontSize.f12,
    },
    ProfileCard: {
      width: "100%",
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 12
      // backgroundColor: colorTheme.buttonBackgroundColor,
    },
    menuCard:{
      width: windowWidth,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      flex: 1,
      height:'100%',
      // justifyContent:'center',
      // alignItems:'flex-start',
      backgroundColor: colorTheme.backgroundColor,
      //flexDirection:'column',
      paddingTop:18,
      paddingLeft:10,
      borderWidth:1,
      borderColor:1
    },
    boxContainer:{
      justifyContent:'center',
      alignItems:'center',
      flexDirection:'row',
      marginTop:8,
      marginLeft:18
    },
    leftBox: {
      width: "45%",
      height: 125,
      paddingVertical: 8,
      paddingHorizontal: 8,
      justifyContent: 'center',
      alignItems:'center',
      backgroundColor: colorTheme.shadeLight,
      borderRadius:12,
      marginRight:5,
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
      width: 30,
    },
  cardText:{
      fontSize:FontSize.f14,
      color:colorTheme.whiteColor,
      marginTop:8,
      fontFamily:FontFamily.medium,
      textAlign:'center'
    },
  });
};
export default Styles;
 