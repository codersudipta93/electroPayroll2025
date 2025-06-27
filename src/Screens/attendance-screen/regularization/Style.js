//import liraries
import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import { useTheme } from '../../../Constants/Theme/Theme';
// import { useTheme } from '../../../Constants/Theme/Theme';
// import { FontFamily, FontSize } from '../../Constants/Fonts';
// import { windowHeight,windowWidth } from '../../Constants/window';


// create a component
const RegularizationStyle = () => {
  const {colorTheme} = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'black',
    },
    
    cardIcon:{
      height: '100%',
      width: '100%',
      resizeMode: "cover",
    },
  });
};
export default RegularizationStyle;