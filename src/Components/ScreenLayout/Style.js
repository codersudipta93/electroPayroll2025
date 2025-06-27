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
     // flex:1,
      flexDirection:'column',
      width:windowWidth,
    },
  });
};
export default Styles;
