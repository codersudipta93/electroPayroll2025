//import liraries
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '../../Constants/Theme/Theme';
// import { useTheme } from '../../../Constants/Theme/Theme';
// import { FontFamily, FontSize } from '../../Constants/Fonts';
// import { windowHeight,windowWidth } from '../../Constants/window';


// create a component
const Styles = () => {
    const { colorTheme } = useTheme();
    // return StyleSheet.create({
    //   container: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     backgroundColor: colorTheme.backGroundColor,
    //   },
    // });
    return StyleSheet.create({
        customScrollView: { backgroundColor:colorTheme.shadeLight, },
        customKeyboardAvoidingView: {},
        cardIcon: {
            height: 20,
            width: 20,
        },
        mainView: {
            paddingLeft: 10, paddingRight: 10, backgroundColor: '#f2f3f9',
            flexDirection: 'column', paddingTop: '5%'
        },
        actionsheetStyle: { backgroundColor: '#ECECEC', borderTopLeftRadius: 15, borderTopRightRadius: 15 },

        dropdown: {
            height: 48,
            borderColor: 'gray',
            borderWidth: 0.5,
            borderRadius: 8,
            paddingHorizontal: 8,

        },

        item: {
            //backgroundColor: '#edfff2',
            padding: 17,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            shadowOffset: { width: 0, height: 3 },
            shadowColor: '#171717',
            shadowOpacity: 0.4,
            shadowRadius: 2,
            zIndex: 999,
           // borderBottomWidth:0.5,
            //borderBottomColor:'#035e1b'
        },
        icon: {
            marginRight: 5,
        },
        label: {
            // position: 'absolute',
            // backgroundColor: 'white',
            // left: 22,
            // top: 8,
            // zIndex: 999,
            // paddingHorizontal: 8,
            fontSize: 14,
        },
        placeholderStyle: {
            fontSize: 13,
            color: '#000'
        },
        selectedTextStyle: {
            fontSize: 14,
            color: '#000'
        },
        iconStyle: {
            width: 20,
            height: 20,
        },
        inputSearchStyle: {
            height: 40,
            fontSize: 16,

        }
    });
};
export default Styles;