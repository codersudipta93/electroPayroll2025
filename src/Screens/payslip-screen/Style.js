//import liraries
import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import { useTheme } from '../../Constants/Theme/Theme';
 import { FontFamily, FontSize } from '../../Constants/Fonts';
 import { windowHeight, windowWidth } from '../../Constants/window';
import { Colors } from 'react-native/Libraries/NewAppScreen';


// create a component
const Styles = () => {
  const {colorTheme} = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      flexDirection: 'column',
      //backgroundColor: colorTheme.buttonBackgroundColor,
      backgroundColor: "#051121",
      //height: windowHeight,

    },
    ProfileCard: {
      width: "100%",
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 12,
       //backgroundColor: colorTheme.buttonBackgroundColor,
       height:'25%' ,
    },
    menuCard:{
       width: '100%',
       borderTopLeftRadius: 12,
       borderTopRightRadius: 12,
       
      // height:'100%',
      // justifyContent:'flex-start',
      // alignItems:'center',
       backgroundColor: '#fff',
      // flexDirection:'column',
    },
    profileImage: {
      height: 65,
      width: 65,
    },
    userName: {
      fontSize: FontSize.f15,
      marginTop: 6,
      color: colorTheme.buttonTextColor,
      textTransform: 'uppercase',
      fontFamily:FontFamily.bold
    },
    salary:{fontSize:14,color:Colors.white,marginTop:5, fontFamily:FontFamily.biold},
    menuWrapper:{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', backgroundColor: colorTheme.whiteColor, borderWidth: 1, borderColor: colorTheme.shadeMedium, padding: 6, width: '95%', marginTop: 8,marginBottom:10, borderRadius: 6, elevation: 6 },
    toDateMain:{  borderRadius: 4, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', backgroundColor: "#dbe3f0", paddingHorizontal:12,width:'48%', paddingVertical: 4 },
    toDateLabel: { marginLeft: 4, color: colorTheme.blackColor, fontSize: FontSize.f14, fontFamily: FontFamily.regular },
    fromDateMain:{ marginLeft: 6, borderRadius: 4, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', backgroundColor: "#dbe3f0", paddingHorizontal: 9, paddingVertical: 4 },
    fromDate:{ marginLeft: 4, color: colorTheme.blackColor, fontSize: FontSize.f14, fontFamily: FontFamily.regular },
    centeredView: {
      ///flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 200,
      height:250,
      
    },
    modalView: {
      margin: 20,
      //marginTop:3,
      backgroundColor: "white",
      borderRadius: 12,
      padding: 35,
      paddingBottom:4,
      paddingTop:10,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
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
      marginBottom: 6,
      textAlign: "center",
      fontWeight:'800',
      marginTop:12,
      color:'#000'
    },
    modalBackground: {
      flex: 1,
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'space-around',
      backgroundColor: '#rgba(0, 0, 0, 0.5)',
     
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