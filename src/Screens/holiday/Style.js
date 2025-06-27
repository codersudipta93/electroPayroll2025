//import liraries
import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import { useTheme } from '../../Constants/Theme/Theme';
 import { FontFamily, FontSize } from '../../Constants/Fonts';
 import { windowHeight,windowWidth } from '../../Constants/window';


// create a component
const HolidayStyle = () => {
  const {colorTheme} = useTheme();
  return StyleSheet.create({
    container: {
      paddingHorizontal: 8, 
      flex: 1,
      backgroundColor: colorTheme.shadeLight,
    },
    listMainContainer:{ width: '100%', paddingHorizontal: 10, backgroundColor: '#fff',elevation:4, marginBottom: 8, borderRadius: 6, paddingTop: 8 },
    listHeader:{ fontWeight: 'bold', color: '#000', fontSize: FontSize.f14, textTransform: 'capitalize',FontFamily:FontFamily.medium },
    leaveRange:{ color: '#696969', fontSize: FontSize.f12,marginLeft:4,fontWeight:'bold'},
    leaveReason:{ color: "#888888", fontSize: FontSize.f13, marginTop: 8, paddingRight: 35 },
    border:{ borderTopWidth: 1, borderColor: '#E8E8E8', marginVertical: 8 },
    listFootersec:{ marginBottom: 6, justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'row' },
    statusContainer:{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    statusIcon:{ width: 10, height: 10, borderRadius: 50 },
    statusText:{ marginLeft: 6, fontSize: FontSize.f12,textTransform:'capitalize'},
    applyDate:{ fontSize: FontSize.f13, color: '#696969',fontWeight:'bold' },

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
    listCard: {
      backgroundColor: '#FFFFFF',
      //width: '100%',
      borderRadius: 8,
      padding: 12,
      //paddingVertical: 10,
      borderWidth: 0.5,
      borderColor: '#00000012',
      backgroundColor: "#fff",
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginBottom: 8
    }
  });
};
export default HolidayStyle;