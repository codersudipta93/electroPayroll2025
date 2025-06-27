//import liraries
import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import { FontFamily, FontSize } from '../../Constants/Fonts';
import { useTheme } from '../../Constants/Theme/Theme';
import { windowHeight,windowWidth } from '../../Constants/window';


// create a component
const Styles = () => {
  const {colorTheme} = useTheme();
  return StyleSheet.create({
    container: {
      height:50,
      width:'100%',
     // backgroundColor: colorTheme.headerColor,
       //backgroundColor:'green'
    },
  });
};
export default Styles;
