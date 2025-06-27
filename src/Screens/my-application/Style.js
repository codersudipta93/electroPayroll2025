//import liraries
import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import { useTheme } from '../../Constants/Theme/Theme';
 import { FontFamily, FontSize } from '../../Constants/Fonts';
 import { windowHeight,windowWidth } from '../../Constants/window';


// create a component
const Styles = () => {
  const {colorTheme} = useTheme();
  return StyleSheet.create({
    container: {
      paddingHorizontal: 8, 
      flex: 1,
      backgroundColor: colorTheme.shadeLight,
    },
    listMainContainer:{ width: '100%', backgroundColor: '#fff',elevation:6, marginBottom: 10, borderRadius: 6, borderWidth:1,borderColor:colorTheme.shadeMedium },
    listHeader:{color: '#000', fontSize: FontSize.f14, textTransform: 'capitalize',FontFamily:FontFamily.bold, marginHorizontal:12,marginTop:12 },
    leaveRange:{ color: '#696969', fontSize: FontSize.f12,marginLeft:4,fontFamily:FontFamily.medium},
    leaveReason:{ color: "#888888", fontSize: FontSize.f13, marginTop: 8, paddingRight: 35 },
    border:{ borderTopWidth: 1, borderColor: '#E8E8E8', marginVertical: 12 },
    listFootersec:{ marginBottom: 6, justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'row', marginHorizontal:12, marginBottom:8 },
    statusContainer:{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    statusIcon:{ width: 10, height: 10, borderRadius: 50 },
    statusText:{ marginLeft: 6, fontSize: FontSize.f12,textTransform:'uppercase'},
    applyDate:{ fontSize: FontSize.f13, color: colorTheme.headerColor, fontFamily:FontFamily.medium},

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
    }
  });
};
export default Styles;