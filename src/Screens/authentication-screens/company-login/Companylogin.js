//import liraries
import React, { createRef, useEffect, useState, useRef } from 'react';
import { View, Text, Keyboard, BackHandler, Alert, ImageBackground, TextInput, TouchableOpacity, KeyboardAvoidingView, ToastAndroid, ActivityIndicator, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Styles from './Style';
import { ScreenLayout } from '../../../Components';
import { useTheme } from '../../../Constants/Theme/Theme';
import { Images } from '../../../Constants/ImageIconContant';
import { getDataWithOutToken, postWithOutToken } from '../../../Service/service';
import { setCompanyDetails } from '../../../Store/Reducers/CommonReducer';
import { useFocusEffect } from '@react-navigation/native';
import { FontFamily } from '../../../Constants/Fonts';
import Icon from 'react-native-vector-icons/Ionicons';
import Snackbar from 'react-native-snackbar';
const CompanyLogin = props => {
  const { colorTheme } = useTheme();
  const styles = Styles();
  const dispatch = useDispatch();
  // const {count} = useSelector(state => state.common);
  const [loadingValue, setLoading] = React.useState(false);

   const [showPassword, setShowPassword] = useState(false);
  // const [companyCode, setCompanycode] = React.useState('crpl');
  // const [companyPassword, setCompanypassword] = React.useState('crpl@123');

  const [companyCode, setCompanycode] = React.useState('');
  const [companyPassword, setCompanypassword] = React.useState('');
  const { companyApiUrl, employeeApiUrl } = useSelector(state => state.common);

  // ==> Button Focas reference create
  const companyPassRef = useRef < TextInput > (null);
  const companyCodeRef = useRef < TextInput > (null);

  useEffect(() => {

  }, []);

  /* == For hardware back button functionality == */
  // useFocusEffect(
  //   React.useCallback(() => {
  //     const onBackPress = () => {
  //       console.log("back click working")
  //       showConfirmDialog( "Alert","Are you sure you want to exit from this app?", "Yes", "APPEXIT")
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

  /* == Verify button function == */
  const clickCompanyLogin = () => {
    Keyboard.dismiss()
    console.log("companyApiUrl : ", companyApiUrl);
    setLoading(true);
    if (!companyCode) {
      setLoading(false);
      showMsg("Company code cannot be blank")
    } else if (!companyPassword) {
      setLoading(false);
      showMsg("Password field cannot be blank")
    } else { 
      let paramData = {
        //"CompanyCode": "saral",
        // "Password": "1234",
        "CompanyCode": companyCode,
        "Password": companyPassword,
      }
      startCompanyLogin(paramData)
    }
  }

  /* == Company login Function == */
  const startCompanyLogin = (paramData) => {
    postWithOutToken(companyApiUrl, 'PayrollApiUrl', paramData)
      .then((resp) => {
        setLoading(false); 
        console.log("company response : ", resp)
        if (resp.Status) {
          dispatch(setCompanyDetails(resp.Data))
          setTimeout(() => {
            props.navigation.replace('EmployeeLogin')
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }



  return (
    <ScreenLayout
      isHeaderShown={false}
      isShownHeaderLogo={false}
      headerTitle="SignIn">
      {/* <SafeAreaView style={{height:'100%'}}> */}
      <ImageBackground
        source={Images.auth_bg}
        style={styles.backgroundImageView}
      >
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={35}
          style={styles.customKeyboardAvoidingView}>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} style={styles.customScrollView}>


            <View style={styles.mainView}>
              <View style={styles.headingContainer}>
                <View>
                  <Text style={[styles.headingText, { fontFamily: FontFamily.regular}]}>Hello, Welcome Back to</Text>
                  <Text style={[styles.headingText, { fontFamily: FontFamily.bold, fontSize: 25, marginRight: 100,  marginTop:5 }]}>Electro Payroll</Text>
                </View>
              </View>

              <View style={styles.spaceView}></View>

              <View style={styles.inputcontainerView}>
                <View>
                  <Text style={styles.inputLable}>Company Code</Text>
                  <TextInput
                    // keyboardType='numeric'
                    value={companyCode}
                    onChangeText={text => setCompanycode(text)}
                    placeholder={'Enter Company code'}
                    autoCapitalize="characters"
                    // underlineColorAndroid={colorTheme.textUnderlineColor}
                    color={colorTheme.whiteColor}
                    placeholderTextColor={colorTheme.whiteColor}
                    style={styles.textinputField}
                    returnKeyType='next'
                    ref={companyCodeRef}
                    onSubmitEditing={() => companyPassRef.current?.focus()}
                  >
                  </TextInput>

                </View>

                {/* <View style={{ marginTop: 20 }}>
                  <Text style={styles.inputLable}>Password</Text>
                  <TextInput
                     secureTextEntry={true}
                    value={companyPassword}
                    onChangeText={text => setCompanypassword(text)}
                    placeholder={'Enter Password'}
                    //underlineColorAndroid={colorTheme.textUnderlineColor}
                    color={colorTheme.whiteColor}
                    placeholderTextColor={'#550256'}
                    style={styles.textinputField}
                    returnKeyType='done'
                    
                    ref={companyPassRef}
                    onSubmitEditing={() => { }}
                  >
                  </TextInput>
                </View> */}


                <View style={{ marginTop: 20 }}>
                  <Text style={styles.inputLable}>Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      secureTextEntry={!showPassword}
                      value={companyPassword}
                      onChangeText={text => setCompanypassword(text)}
                      placeholder={'Enter Password'}
                      color={colorTheme.whiteColor}
                      placeholderTextColor={colorTheme.whiteColor}
                      style={styles.passwordInput}
                      returnKeyType='done'
                      ref={companyPassRef}
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

                {/* <View style={styles.forgotPassView}>
                  <TouchableOpacity onPress={() => { alert("Forgot password clicked") }}>
                    <Text style={styles.forgotPassText}>Forgot password?</Text>
                  </TouchableOpacity>
                </View> */}
  
                <TouchableOpacity style={styles.submitView} onPress={() => { !loadingValue && companyPassword.trim() && companyCode.trim() ? clickCompanyLogin() : null }}>
                  <View
                    style={[styles.submitBtnView, { opacity: companyPassword.trim() && companyCode.trim() ? 1 : 0.5 }]}
                  //onPress={() => { !loadingValue && companyPassword.trim() && companyCode.trim() ? clickCompanyLogin() : null }}
                  >   
                    {loadingValue
                      ? <View style={{justifyContent:'center', alignItems:'center',flexDirection:'row'}}>
                      <ActivityIndicator 
                        animating={true} 
                        hidesWhenStopped={true}
                        color={colorTheme.headerColor}
                      ></ActivityIndicator>
                      <Text style={{color:colorTheme.headerColor,fontFamily:FontFamily.regular}}> Please Wait...</Text>
                      </View>
                      :
                      <Text style={styles.submitBtnTextStyle}>VERIFY</Text>
                    }
                    {/* <Text style={styles.submitBtnTextStyle}>VERIFY</Text> */}
 
                  </View>
                </TouchableOpacity>
              </View>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
      {/* </SafeAreaView> */}
      {/* </ScrollView> */}
    </ScreenLayout>
  );
};

//make this component available to the app
export default CompanyLogin;
