//import liraries
import React, {Component, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import { ScreenLayout } from '../../Components';
import { useTheme } from '../../Constants/Theme/Theme';
import { getDataWithOutToken } from '../../Service/service';
import {
  decrement,
  increment,
  setCount,
} from '../../Store/Reducers/CommonReducer';
// import Styles from './Style';

// create a component
const DashboardDetails = () => {

  return (
    // <View>
    //   <Text>Extrascreen</Text>
    // </View>
    <ScreenLayout
      isHeaderShown={true}
      isShownHeaderLogo={false}
      headerTitle="Dashboard Details">
      <View
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          
        <Text
          onPress={() => {
            // console.log("Signup working")
            // EventRegister.emit('loginsuccess', true)
          }
          }
          // style={{color: colorTheme.fontColor}}
          >
          This is Dashboard details
        </Text>
      </View>
    </ScreenLayout>
  );
};

//make this component available to the app
export default DashboardDetails;
