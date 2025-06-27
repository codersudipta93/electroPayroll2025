//import liraries
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '../../Constants/Theme/Theme';
// import { useTheme } from '../../../Constants/Theme/Theme';
import { FontFamily, FontSize } from '../../Constants/Fonts';
import { windowHeight, windowWidth } from '../../Constants/window';


// create a component
const Styles = () => {
  const { colorTheme } = useTheme();
  return StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center', 
      backgroundColor: colorTheme.shadeLight,
      paddingHorizontal:8,
      borderTopLeftRadius: 12, borderTopRightRadius: 12,
    },
    listMainContainer: {
      width: '100%',
      backgroundColor: '#fff',
      elevation: 4,
      marginBottom: 8,
      borderRadius: 6,
      flexDirection:'row',
      borderWidth:0.5,
      borderColor:'#000',
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      //marginTop: 22
    },
    modalView: {
      //margin: 10,
      backgroundColor: "#fff",
      borderRadius:75/2,
      height:5,
      width:55,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      justifyContent:'center',
      alignItems:'center'
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "#2196F3",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    },
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
    modalText: {
      marginBottom: 6,
      textAlign: "center",
      fontWeight:'800',
      marginTop:12,
      color:'#000'
    },
    menuWrapper:{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', backgroundColor: colorTheme.whiteColor, borderWidth: 1, borderColor: colorTheme.shadeMedium, padding: 6, width: '90%', marginTop: 8,marginBottom:10, borderRadius: 6, elevation: 6 },
    toDateMain:{  borderRadius: 4, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', backgroundColor: "#dbe3f0", paddingHorizontal:12,width:'48%', paddingVertical: 4 },
    toDateLabel: { marginLeft: 4, color: colorTheme.blackColor, fontSize: FontSize.f14, fontFamily: FontFamily.regular },
    fromDateMain:{ marginLeft: 6, borderRadius: 4, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', backgroundColor: "#dbe3f0", paddingHorizontal: 9, paddingVertical: 4 },
    fromDate:{ marginLeft: 4, color: colorTheme.blackColor, fontSize: FontSize.f14, fontFamily: FontFamily.regular },
  });
};
export default Styles;