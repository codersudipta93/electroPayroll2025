//import liraries
import React, { useEffect, useRef } from 'react';
import { View, Animated, Text, StyleSheet, ImageBackground, Image, Dimensions, PermissionsAndroid } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ScreenLayout } from '../../Components';
import { Images } from '../../Constants/ImageIconContant';
import { useTheme } from '../../Constants/Theme/Theme';
import { getData } from '../../Service/localStorage';
import {
  localstorage_CompanyDetailsAdd,
  localstorage_EmployeeApiUrlAdd,
  localstorage_EmployeeDetailsAdd,
  localstorage_TokenAdd,
  clearEmpAndCompanyDetails,
  setFcmPlayerID
} from '../../Store/Reducers/CommonReducer';

import Styles from './Style';
//import RNBootSplash from 'react-native-bootsplash';
import OneSignal from 'react-native-onesignal';
import * as Animatable from 'react-native-animatable';

// create a component
const Initial = props => {
  const { colorTheme } = useTheme();
  const styles = Styles()
  const dispatch = useDispatch();
  const ONESIGNAL_APP_ID = 'cf6549d5-5c76-4c07-ad27-f4ddee0af2b6'
  const { companyApiUrl, companyDetails, employeeApiUrl, token, fcmPlayerId } = useSelector(state => state.common);
  const textOpacity = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const getDeviceToken = async () => {

    OneSignal.setAppId('cf6549d5-5c76-4c07-ad27-f4ddee0af2b6');

    try {
      const deviceState = await OneSignal.getDeviceState();
      const { userId } = deviceState;

      if (userId) {
        console.log(userId)
        dispatch(setFcmPlayerID(userId))
        alert(userId)

      } else {
        console.warn('Push token is undefined. Try again...');

        getDeviceToken();
        // You can handle this case as needed, e.g., retry or show an error message.
      }
    } catch (error) {
      console.error('Error getting device state:', error);
      // Handle error, e.g., retry or show an error message.
      getDeviceToken();
    }

    OneSignal.promptForPushNotificationsWithUserResponse();
    OneSignal.setNotificationWillShowInForegroundHandler(
      notificationReceivedEvent => {
        console.log(
          'OneSignal: notification will show in foreground:',
          notificationReceivedEvent,
        );
        let notification = notificationReceivedEvent.getNotification();
        notificationReceivedEvent.complete(notification);
      },
    );

    //Method for handling notifications opened
    OneSignal.setNotificationOpenedHandler(notification => {
      console.log('OneSignal: notification opened:', notification);
    });

  }

  useEffect(() => {
    console.log("useeffect calling")

    getDeviceToken()
    findOnesignalPlayerId()
    // requestCameraPermission()

    setTimeout(() => {
      getData('token').then((tokenSuccess) => {
        if (tokenSuccess) {
          dispatch(localstorage_TokenAdd(tokenSuccess));

          getData('employeeData').then((empSucess) => {
            if (empSucess) {
              dispatch(localstorage_EmployeeDetailsAdd(JSON.parse(empSucess)))

              getData('companyDetails').then((companySuccess) => {
                if (companySuccess) {
                  dispatch(localstorage_CompanyDetailsAdd(JSON.parse(companySuccess)))

                  getData('employeeApiUrl').then((empUrlsuccess) => {
                    if (empUrlsuccess) {
                      dispatch(localstorage_EmployeeApiUrlAdd(empUrlsuccess))
                      offSplashScreen('Home');
                      //props.navigation.replace('Home');

                    } else {
                      dispatch(clearEmpAndCompanyDetails())
                      offSplashScreen('CompanyLogin');
                      // props.navigation.replace('CompanyLogin');
                    }
                  })

                } else {
                  dispatch(clearEmpAndCompanyDetails())
                  offSplashScreen('CompanyLogin');
                  // props.navigation.replace('CompanyLogin');
                }
              })

            } else {
              dispatch(clearEmpAndCompanyDetails())
              offSplashScreen('CompanyLogin');
              // props.navigation.replace('CompanyLogin');
            }
          })

        } else {
          dispatch(clearEmpAndCompanyDetails())
          offSplashScreen('CompanyLogin');
          //props.navigation.replace('CompanyLogin');
        }

      })

    }, 200);

  }, []);

  /*
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Electropayroll camera permission',
          message:
            'Electropayroll requires notification permission to send notification',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the Notification');
      } else {
        console.log('Notification permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  */

  /* == For finding onesignal player ID == */
  const findOnesignalPlayerId = async () => {
    OneSignal.setAppId('cf6549d5-5c76-4c07-ad27-f4ddee0af2b6');

    try {
      const data = await OneSignal.getDeviceState();
      const player_id = data.userId;
      console.log("player_id :", player_id);
      if (player_id) {
        dispatch(setFcmPlayerID(player_id))
      }
    } catch (error) {
      console.log(error);
    }
  };

  const offSplashScreen = (compName) => {
    console.log("settimeout calling")
    setTimeout(() => {
     // RNBootSplash.hide({ fade: true });
      props.navigation.replace(compName);
    }, 1000);
  }  

  return (   
  
    <View style={styles.container}>
      {/* <StatusBar barStyle={'light-content'} backgroundColor={colors.primary} /> */}
       <ImageBackground source={Images.splash_bg} resizeMode="cover" style={[styles.image,{paddingTop:130,alignItems:'center'}]}> 
        {/* <Animatable.View style={styles.logoContainer} animation="zoomInUp"> */}
          <Animatable.Image 
            style={{  
              width: 230, 
              height: 95,  
              objectFit:'contain'
               
            }}
            source={Images.splash_logo}
            animation="zoomInUp"
          />
        {/* </Animatable.View>  */}
       </ImageBackground> 
    </View>
  );
};


//make this component available to the app
export default Initial;
