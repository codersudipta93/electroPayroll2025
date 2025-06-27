//import liraries
import React, { Component, createRef, useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ImageBackground, TextInput, TouchableOpacity, Keyboard, KeyboardAvoidingView, ToastAndroid, ActivityIndicator, ScrollView, BackHandler, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Styles from './Style';
import { ScreenLayout } from '../../../Components';
import { useTheme } from '../../../Constants/Theme/Theme';
import { EventRegister } from 'react-native-event-listeners'
import { Images } from '../../../Constants/ImageIconContant';
import { FontFamily } from '../../../Constants/Fonts';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { postWithOutToken } from '../../../Service/service';
import { setEmployeeDetails } from '../../../Store/Reducers/CommonReducer';
import { setData } from '../../../Service/localStorage';
import Snackbar from 'react-native-snackbar';
// create a component
const EmployeeLogin = props => {
  const { colorTheme } = useTheme();
  const styles = Styles();
  const dispatch = useDispatch();
  // const {count} = useSelector(state => state.common);
  const [loadingValue, setLoading] = React.useState(false);
  const [employeeId, setEmployeeId] = React.useState('');
  const [employeePassord, setEmployeepassord] = React.useState('');
  const { companyApiUrl, companyDetails, employeeApiUrl, fcmPlayerId } = useSelector(state => state.common);

  const [ForgotPasswordLoadingValue, setForgotPasswordLoadingValue] = React.useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  // ==> Button Focas reference create
  const employeeIdRef = useRef < TextInput > (null);
  const employeePassordRef = useRef < TextInput > (null);

  useEffect(() => {

  }, [employeeId, employeePassord]);


  /* == For hardware back button functionality == */
  // useFocusEffect(
  //   React.useCallback(() => {
  //     const onBackPress = () => {
  //       console.log("back click working")
  //       props.navigation.replace('CompanyLogin')
  //       return true;
  //     };
  //     BackHandler.addEventListener('hardwareBackPress', onBackPress);
  //     return () =>
  //       BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  //   }, [])
  // );

  /* == Show Toast msg function == */
  const showMsg = (msg) => {
    Snackbar.show({
      text: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

  /* == Employee login button function == */
  const clickEmpLogin = () => {
    setLoading(true);

    if (!employeeId) {
      setLoading(false);
      showMsg("Employee ID field cannot be blank")
    } else if (!employeePassord) {
      setLoading(false);
      showMsg("Password field cannot be blank")
    } else {
      let paramData = {
        //"EmployeeNo":"989",
        //"Password":"1234",
        "EmployeeNo": employeeId,
        "Password": employeePassord,
        "FCMId": fcmPlayerId ? fcmPlayerId : " "
      }
      startEmployeeLogin(paramData);
      Keyboard.dismiss()
    }
  }

  /* == Company login Function == */
  const startEmployeeLogin = (paramData) => {
    postWithOutToken(employeeApiUrl, '/EmployeeLogIn', paramData)
      .then((resp) => {
        setLoading(false);
        console.log("Employee response : ", resp)
        if (resp.Status) {
          showMsg("Employee login successfull");
          dispatch(setEmployeeDetails(resp.Data))
          storeDataToLocalstorage(resp.Data);
          setTimeout(() => {
            setLoading(false);
            props.navigation.replace('Home')
          }, 500);
        } else {
          showMsg(resp.msg)
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log("company error : ", error)
      })
  }

  /* == Localstorage data add Function == */
  const storeDataToLocalstorage = (employeeData) => {
    setData("companyDetails", JSON.stringify(companyDetails));
    setData("companyApiUrl", JSON.stringify(companyApiUrl));
    setData("employeeData", JSON.stringify(employeeData));
    setData("employeeApiUrl", employeeApiUrl);
    setData("token", employeeData.Token);
  }


  const forgotPassword = () => {
    setForgotPasswordLoadingValue(true);
    postWithOutToken(employeeApiUrl, '/EmployeeForgotPassword', { EmployeeNo: employeeId })
      .then((resp) => {
        setForgotPasswordLoadingValue(false);
        console.log("forgot password response : ", resp)
        if (resp.Status == true) {
          setEmployeeId("")
          setModalVisible(!modalVisible);
          showMsg(resp.Message)
        } else {
          showMsg(resp.Message)
        }
      })
      .catch((error) => {
        setForgotPasswordLoadingValue(false);
        console.log("company error : ", error)
      })

  }


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }


  return (
    <ScreenLayout
      isHeaderShown={false}
      isShownHeaderLogo={false}
      headerTitle="SignIn">

      <TouchableOpacity
        onPress={() => {
          props.navigation.replace('CompanyLogin')
        }}
        style={{ position: 'absolute', top: 1, left: 1, zIndex: 999, width: 60, height: 60, flexDirection: 'column', justifyContent: 'center', borderRadius: 60 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Icon name="arrow-back" size={20} color={colorTheme.headerTextColor}
          />
        </View>
      </TouchableOpacity>

      <ImageBackground
        source={Images.auth_bg}
        style={styles.backgroundImageView}
      >
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={35}
          style={styles.customKeyboardAvoidingView}>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.customScrollView} keyboardShouldPersistTaps={'handled'}>

            <View style={styles.mainView}>
              <View style={styles.headingContainer}>
                <View>
                  <Text style={[styles.headingText, { fontFamily: FontFamily.regular }]}>Hello, Employee</Text>
                  <Text style={[styles.headingText, { fontFamily: FontFamily.bold, fontSize: 25, marginRight: 100, marginTop: 5 }]}>{companyDetails?.CompanyName}</Text>
                </View>
              </View>

              <View style={styles.spaceView}></View>

              <View style={styles.inputcontainerView}>
                <View>
                  <Text style={styles.inputLable}>Employee Id</Text>
                  <TextInput
                    //keyboardType='numeric'
                    value={employeeId}
                    onChangeText={text => setEmployeeId(text)}
                    placeholder={'Enter Employee id'}
                    // underlineColorAndroid={colorTheme.textUnderlineColor}
                    color={colorTheme.whiteColor}
                    placeholderTextColor={colorTheme.whiteColor}
                    style={styles.textinputField}
                    returnKeyType='next'
                    autoCapitalize="characters"
                    ref={employeeId}
                    onSubmitEditing={() => employeePassordRef.current?.focus()}
                  >
                  </TextInput>
                </View>

                {/* <View style={{ marginTop: 20 }}>
                  <Text style={styles.inputLable}>Password</Text>
                  <TextInput
                    secureTextEntry={true}
                    value={employeePassord}
                    onChangeText={text => setEmployeepassord(text)}
                    placeholder={'Enter Password'}
                    // underlineColorAndroid={colorTheme.textUnderlineColor}
                    color={colorTheme.whiteColor}
                    placeholderTextColor={colorTheme.whiteColor}
                    style={styles.textinputField}
                    returnKeyType='done'
                    ref={employeePassordRef}
                    onSubmitEditing={() => { }}
                  >
                  </TextInput>
                </View> */}


                <View style={{ marginTop: 20 }}>
                  <Text style={styles.inputLable}>Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      secureTextEntry={showPassword ? true :false}
                      value={employeePassord}
                      onChangeText={text => setEmployeepassord(text)}
                      placeholder={'Enter Password'}
                      // underlineColorAndroid={colorTheme.textUnderlineColor}
                      color={colorTheme.whiteColor}
                      placeholderTextColor={colorTheme.whiteColor}

                      style={styles.passwordInput}
                      returnKeyType='done'
                      ref={employeePassordRef}
                      onSubmitEditing={() => { }}
                    />
                    <TouchableOpacity
                      style={styles.eyeIconContainer}
                      onPress={togglePasswordVisibility}
                      activeOpacity={0.7}
                    >
                      <Icon
                        name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                        size={22}
                        color="#d971f6"
                      />
                    </TouchableOpacity>
                  </View>
                </View>



                <View style={styles.forgotPassView}>
                  <TouchableOpacity onPress={() => { setModalVisible(!modalVisible); }}>
                    <Text style={styles.forgotPassText}>Forgot password?</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => { !loadingValue && employeePassord.trim() && employeeId.trim() ? clickEmpLogin() : null }}
                  style={styles.submitView}>
                  <View 
                    style={[styles.submitBtnView, { opacity: employeePassord.trim() && employeeId.trim() ? 1 : 0.5 }]}
                  >
                    {/* <Text style={styles.submitBtnTextStyle}>LOGIN</Text> */}
                    {loadingValue ?  
                      <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <ActivityIndicator
                          animating={true} 
                          hidesWhenStopped={true}
                          color={colorTheme.headerColor}
                        ></ActivityIndicator>
                        <Text style={{ color: colorTheme.headerColor, fontFamily: FontFamily.regular }}> Please Wait...</Text>
                      </View>
                      :
                      <Text style={styles.submitBtnTextStyle}>LOGIN</Text>
                    }
                  </View>
                </TouchableOpacity>


              </View>



            </View>

          </ScrollView>
        </KeyboardAvoidingView>

        {/* Forgot Password */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setEmployeeId("")
            setModalVisible(!modalVisible);
          }}

        >

          <KeyboardAvoidingView behavior="padding" enabled style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }} keyboardShouldPersistTaps={'handled'}>
            <Pressable style={styles.containerStyle}>

              <ScrollView
                style={styles.content}
                keyboardShouldPersistTaps={'handled'}
              >
                <Icon name="close" size={28} color="#000" style={{ textAlign: 'right', marginTop: 12 }} onPress={() => {
                  setModalVisible(!modalVisible)
                }} />
                <Text style={styles.modalText}>Forgot Password?</Text>
                <Text style={styles.submodalText}>Please enter your employee ID to receive password to your email</Text>
                <View style={{ marginTop: 20 }}>
                  {/* <Text style={[styles.inputLable,{color:'black'}]}>Employee Id</Text> */}
                  <TextInput
                    // keyboardType='numeric'
                    value={employeeId}
                    onChangeText={text => setEmployeeId(text)}
                    placeholder="Employee Id"

                    underlineColorAndroid={colorTheme.textUnderlineColor}
                    color={colorTheme.textFontColor}
                    placeholderTextColor={colorTheme.shadeMedium}
                    style={styles.textinputField}
                  //returnKeyType='enter'
                  // onSubmitEditing={() => this.empIdRef.focus()}
                  >
                  </TextInput>

                </View>

                <Pressable
                  style={[styles.button, styles.buttonClose, { opacity: employeeId.trim() ? 1 : 0.5 }]}
                  onPress={() => {
                    //setModalVisible(!modalVisible)
                    ForgotPasswordLoadingValue == false ? forgotPassword() : null
                  }}>
                  {ForgotPasswordLoadingValue
                    ?
                    <ActivityIndicator
                      animating={true}
                      hidesWhenStopped={true}
                      color={colorTheme.whiteColor}
                    ></ActivityIndicator>
                    :
                    <Text style={styles.textStyle}>Forgot Password</Text>
                  }

                </Pressable>
              </ScrollView>
            </Pressable>
          </KeyboardAvoidingView>

        </Modal>
      </ImageBackground>
    </ScreenLayout>
  );
};

//make this component available to the app
export default EmployeeLogin;
