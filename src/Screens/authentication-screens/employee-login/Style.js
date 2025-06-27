//import liraries
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { FontFamily } from '../../../Constants/Fonts';
import { useTheme } from '../../../Constants/Theme/Theme';
import { FontSize } from '../../Constants/Fonts';
import { windowHeight, windowWidth } from '../../Constants/window';


// create a component
const Styles = () => {
  const { colorTheme } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colorTheme.backgroundColor,
    },
    customScrollView: { height: '100%', },
    customKeyboardAvoidingView: { height: '100%' },
    backgroundImageView: { width: '100%', height: '100%' },
    mainView: { flex: 1, flexDirection: 'column', padding: 20, paddingTop: 100 },
    headingContainer: { flex: 1, flexDirection: 'column', justifyContent: 'flex-end', },
    headingText: {
      fontSize: 18, color: 'white', 
      fontFamily: FontFamily.bold,
      
    },
    spaceView: { height: 50 },
    inputcontainerView: { flex: 2 },
    inputLable: {
      color: 'white', fontSize: 13, fontWeight: '400', letterSpacing: 0.5,
      fontFamily: FontFamily.regular,
      paddingLeft: 5
    },
    textinputField: {
      marginTop: 12,
      padding: 0,
      height: 48,
      fontWeight: '400',
      letterSpacing: 0.5,
      fontFamily: FontFamily.regular,
      paddingLeft: 8,
      borderWidth: 1,
      borderColor: '#fff',
      borderRadius:8,
    
    },

    // Password input with eye icon
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 48,
      marginTop: 12,
      borderWidth: 1,
      borderColor: '#fff',
      borderRadius: 8,
      position: 'relative',
    },
    passwordInput: {
      flex: 1,
      height: '100%',
      paddingLeft: 8,
      paddingRight: 40, // Space for the eye icon
      fontWeight: '400',
      letterSpacing: 0.5,
      fontFamily: FontFamily.regular,
      color: colorTheme.whiteColor,
    },
    eyeIconContainer: {
      position: 'absolute',
      right: 10,
      height: 48,
      width: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },

    forgotPassView: { marginTop: 20, flexDirection: 'row', justifyContent: 'flex-end' },
    forgotPassText: {
      color: 'white', fontSize: 12, fontWeight: '700', letterSpacing: 0.5,
      fontFamily: FontFamily.regular,
      paddingLeft: 5
    },
    submitView: { marginTop: 30, flexDirection: 'row', justifyContent: 'center' },
    //"#0051e5"
    submitBtnView: {
      height: 50, backgroundColor: colorTheme.whiteColor, width: '100%', borderRadius: 5, flexDirection: 'column', justifyContent: 'center'
    },
    submitBtnTextStyle: {
      color: colorTheme.headerColor, fontSize: 13, fontWeight: '700', letterSpacing: 0.5,
      fontFamily: FontFamily.regular,
      paddingLeft: 5, textAlign: 'center'
    },

 containerStyle: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'flex-end',

  },
  content: {
      width: '100%',
      height: '45%',
      paddingBottom: 16,
      backgroundColor: '#fff',
      overflow: 'hidden',
      borderTopLeftRadius:12,
      borderTopRightRadius:12,
      paddingHorizontal:16,
      //backgroundColor: 'red'
      
  },
    button: {
      borderRadius: 5,
      padding: 10,
      elevation: 2,
      marginTop:12,
      height:48
    },
    buttonOpen: {
      backgroundColor: colorTheme.headerColor,
    },
    buttonClose: {
      backgroundColor: "#0051e5",
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginTop: 0,
      textAlign: 'left',
      fontSize:22,
      color: colorTheme.shadeDark,
    },
    submodalText:{
      fontSize:13,
      paddingRight:25,
      marginTop:13
    },


  });
};
export default Styles;