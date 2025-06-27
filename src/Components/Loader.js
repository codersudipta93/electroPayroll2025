import React from 'react';
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { windowHeight, windowWidth } from '../Constants/window';
import { Images } from '../Constants/ImageIconContant';

const Loader = ({ size = 30, color = '#000', visible }) => {
  return (
    visible ?
     <View style={{
             position: 'absolute',
             top: windowHeight / 10,
             left: 0,
             right: 0,
             bottom: 0,
             justifyContent: 'center',
             alignItems: 'center',
     
           }}>
             <Image source={Images.loader_new} style={{ height: 85, width: 85, borderRadius: 42.5 }} />
           </View> : null
  );
};

const styles = StyleSheet.create({
  overlay: {
    height: windowHeight,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: windowHeight / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loaderContainer: {
    padding: 4,
    backgroundColor: 'white', 
    borderRadius: 50,
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default Loader;
