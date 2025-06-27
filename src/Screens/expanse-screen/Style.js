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
    listMainContainer:{ width: '100%',  backgroundColor: '#fff',elevation:4, marginBottom: 8, borderRadius: 6, paddingTop:4 },
    listHeader:{ fontFamily:FontFamily.bold, color: '#000', fontSize: FontSize.f14, textTransform: 'capitalize',FontFamily:FontFamily.medium, textAlign:'left' },
    leaveRange:{ color: colorTheme.headerColor, fontSize: FontSize.f13,marginLeft:4, fontFamily:FontFamily.bold},
    leaveReason:{ color:colorTheme.blackColor, fontSize: FontSize.f13,fontFamily:FontFamily.medium},
    border:{ borderTopWidth: 1, borderColor: '#E8E8E8', marginBottom: 8 },
    listFootersec:{ marginBottom: 6, justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row' },
    statusContainer:{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    statusIcon:{ width: 10, height: 10, borderRadius: 50 },
    statusText:{ marginLeft: 6, fontSize: FontSize.f12,textTransform:'uppercase'},
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
     // zIndex: 1000
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