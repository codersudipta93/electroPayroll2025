//import liraries
import React, {Component} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import { FontFamily, FontSize } from '../../Constants/Fonts';
import { useTheme } from '../../Constants/Theme/Theme';
import { windowHeight,windowWidth } from '../../Constants/window';


// create a component
const Styles = () => {
  const {colorTheme} = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:'#092173',
      
    },
    logoContainer: {
      height: 160,
      width: 160,
      borderRadius: 80,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth:2.5,
      borderColor:'#092173',
    },
    image: {
      flex: 1,
      //justifyContent: 'center',
      //alignItems: 'center',
      width:'100%'
    },
    footer: {
     position: 'absolute',
      left: 0,
      right: 20,
      bottom: 20
    },
    text: {
      textAlign: 'right',
      color: '#fff',
      textTransform: 'uppercase',
      fontFamily: FontFamily.medium,
      fontSize: FontSize.f12,
  },
  });
};
export default Styles;
