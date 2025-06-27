//import liraries
import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import { useTheme } from '../../Constants/Theme/Theme';
// import { useTheme } from '../../../Constants/Theme/Theme';
// import { FontFamily, FontSize } from '../../Constants/Fonts';
// import { windowHeight,windowWidth } from '../../Constants/window';


// create a component
const Styles = () => {
  const {colorTheme} = useTheme();
  // return StyleSheet.create({
  //   container: {
  //     flex: 1,
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //     backgroundColor: colorTheme.backGroundColor,
  //   },
  // });
  return StyleSheet.create({
    
    cardIcon:{
      height: 20,
      width: 20,
    },
    mainView:{paddingLeft:10,paddingRight:10,backgroundColor:'#f2f3f9',
    height:'100%',flexDirection:'column',paddingTop:'20%'},
    actionsheetStyle:{backgroundColor:'#ECECEC',borderTopLeftRadius:15,borderTopRightRadius:15},
  });
};
export default Styles;