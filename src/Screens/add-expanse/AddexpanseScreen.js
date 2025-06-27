import React, { Component, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  SafeAreaView,
  TextInput,
  ToastAndroid,
  ActivityIndicator,
  Image 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { postWithToken } from '../../Service/service';
import { DashDetails } from '../Screens';

import { useTheme } from '../../Constants/Theme/Theme';
import Styles from './Style';
import { ScreenLayout } from '../../Components';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { Images } from '../../Constants/ImageIconContant';
import Icon from 'react-native-vector-icons/Ionicons';
import { FontFamily } from '../../Constants/Fonts';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Snackbar from 'react-native-snackbar';
import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions';

// create a component
const AddExpanseScreen = props => {
  const { colorTheme } = useTheme()
  const styles = Styles();
  const dispatch = useDispatch();
  const { count } = useSelector(state => state.common);

  const [selectedLeaveType, setLeaveType] = useState();
  const [showStartDateCalender, setStartDateCalender] = useState(false);
  const { employeeDetails, employeeApiUrl, token } = useSelector(state => state.common);

  // params list
  const [expenseDate, setStartDate] = useState("");
  const [Remarks, setRemarks] = useState('');
  const [Amount, setAmount] = useState('');
  const [Purpose, setPurpose] = useState('');
  const [loadingValue, setloadingValue] = useState(false);

  const [image1Base64, setimage1Base64] = useState('');
  const [image2Base64, setimage2Base64] = useState('');
  const [image3Base64, setimage3Base64] = useState('');
  const [image4Base64, setimage4Base64] = useState('');

  const [image1, setimage1] = useState('');
  const [image2, setimage2] = useState('');
  const [image3, setimage3] = useState('');
  const [image4, setimage4] = useState('');

  useEffect(() => {


  }, [])

  // ===== Convert date as yy-mm-dd format function =====
  const formatDate = ((date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('/');
  })


  const checkCameraPermission = async () => {
  const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

  const result = await check(permission);
  if (result === RESULTS.DENIED || result === RESULTS.LIMITED) {
    const reqResult = await request(permission);
    if (reqResult !== RESULTS.GRANTED) {
      Alert.alert('Permission required', 'Camera permission is required to take photos');
      return false;
    }
  } else if (result === RESULTS.BLOCKED) {
    Alert.alert(
      'Permission blocked',
      'Camera permission is blocked. Please enable it from settings.'
    );
    return false;
  }
  return true;
}


  const openCamera = async (imgNo) => {

  //   const hasPermission = await checkCameraPermission();
  // if (!hasPermission) return;

    let options = {
      includeBase64: true,
      quality: 0.5
    }
    
  launchCamera(options, (response) => {
    if (response.didCancel) {
      alert('User cancelled camera');
    } else if (response.errorCode) {
      console.log('Camera Error: ', response);
    } else {
      let res = response?.assets[0];
      if (res) {
        if (imgNo == '1') {
          setimage1(res.uri);
          setimage1Base64('data:image/jpeg;base64,' + res.base64);
        } else if (imgNo == '2') {
          setimage2(res.uri);
          setimage2Base64('data:image/jpeg;base64,' + res.base64);
        } else if (imgNo == '3') {
          setimage3(res.uri);
          setimage3Base64('data:image/jpeg;base64,' + res.base64);
        } else if (imgNo == '4') {
          setimage4(res.uri);
          setimage4Base64('data:image/jpeg;base64,' + res.base64);
        }
      }
    }
  });

  }

  const addExpense_function = () => {
    if (!expenseDate) {
      showMsg("Expense date can not be blank")
    } else if (!Purpose) {
      showMsg("Purpose of expense can not be blank")
    } else if (!Amount) {
      showMsg("Expense amount can not be blank")
    } else if (Amount <= 0) {
      showMsg("Expense amount can be greater than ZERO")
    } else {
      setloadingValue(true);
      setTimeout(() => {
        submitExpense()
      }, 1000);
    }
  }

  const submitExpense = () => {
    let paramData = {
      EmployeeId: employeeDetails?.EmployeeId,
      Token: token,
      ExpenseDate: expenseDate,
      Amount: Amount,
      Image1: image1Base64.toString(),
      Image2: image2Base64.toString(),
      Image3: image3Base64.toString(),
      Image4: image4Base64.toString(),
      Purpose: Purpose,
      Remarks: Remarks
    }
   
    //uploadFile(employeeApiUrl, '/MyExpenseInsert', paramData)
    postWithToken(employeeApiUrl, '/MyExpenseInsert', paramData)
      .then((resp) => {
        console.log("MyExpenseInsert : ", resp)
        setloadingValue(false);
        if (resp.Status == true) {
          showMsg(resp.msg);
          setTimeout(() => {
            props.navigation.goBack();
          }, 1000);
        } else {
          showMsg(resp.msg)
        }
      })
      .catch((error) => {
        setloadingValue(false);
        console.log("MyExpenseInsert api error : ", error)
      })
  }

  /* == Show Toast msg function == */
 const showMsg = (msg) => {
    Snackbar.show({
      text: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

  return (
    <ScreenLayout
      isHeaderShown={true}
      isShownHeaderLogo={false}
      headerTitle="Add Expenses"
      headerbackClick={() => { props.navigation.goBack() }}

    >
      <ScrollView style={{ backgroundColor: colorTheme.shadeLight, borderRadius:12 }} showsVerticalScrollIndicator={false}>

        {/* start date calender */}
        <DatePicker
          modal
          open={showStartDateCalender}
          date={new Date()}
          mode="date"
          androidVariant="nativeAndroid"
          textColor="#093b85"
          cancelText="Close"
          //minimumDate={moment().toDate()}
          onConfirm={(selectedDate) => {
            const tempDate = formatDate(selectedDate)
            setStartDate(tempDate);
            setStartDateCalender(false);
          }}
          onCancel={() => {
            setStartDateCalender(false);
          }}
        />



        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, borderRadius:12}} >
          <View style={{ flex: 1, height: 40, flexDirection: 'row', marginLeft: 30, marginRight: 30, justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                // onPress={()=>actionSheetRef.current?.show()}
                onPress={() => setStartDateCalender(true)}
                style={{
                  flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: '#fff',
                  borderWidth: 0.4,
                  padding: 10, borderRadius: 5
                }}>
                <View>
                  <Icon name="calendar-outline" size={18} color="#696969" />
                </View>
                <View style={{ flexDirection: 'column', justifyContent: 'center', paddingLeft: 5 }}>
                  <Text style={{ fontFamily: FontFamily.medium, color: expenseDate ? '#000' : 'grey' }}>{expenseDate ? expenseDate : 'Expense Date'}</Text>
                </View>

              </TouchableOpacity>
            </View>

          </View>
        </View>

        <View style={{ borderWidth: 0.4, marginTop: 20, marginLeft: 30, marginRight: 30, borderRadius: 5, backgroundColor: '#fff', }}>
          <TextInput
            // style={styles.input}
            style={{ height: 45, color: 'black', justifyContent: 'flex-start', paddingLeft: 10, fontFamily: FontFamily.medium }}
            //multiline={true}
            onChangeText={text => setPurpose(text)}
            value={Purpose}
            placeholder={"Purpose"}
            //placeholderTextColor={'#000'}
            textAlignVertical={'top'}
          />

        </View>

        <View style={{ borderWidth: 0.4, marginTop: 20, marginLeft: 30, marginRight: 30, borderRadius: 5, backgroundColor: '#fff', }}>
          <TextInput
            // style={styles.input}
            style={{ height: 45, color: 'black', justifyContent: 'flex-start', paddingLeft: 10, fontFamily: FontFamily.medium }}
            //multiline={true}
            keyboardType="number-pad"
            onChangeText={text => setAmount(text)}
            value={Amount}
            placeholder={"Amount"}
            //placeholderTextColor={'#000'}
            textAlignVertical={'top'}
          />

        </View>

        <View style={{ borderWidth: 0.4, marginTop: 20, marginLeft: 30, marginRight: 30, borderRadius: 5, backgroundColor: '#fff', }}>
          <TextInput
            // style={styles.input}
            style={{ height: 100, color: 'black', justifyContent: 'flex-start', paddingLeft: 10, fontFamily: FontFamily.medium }}
            multiline={true}
            onChangeText={text => setRemarks(text)}
            value={Remarks}
            placeholder={"Remarks"}
            //placeholderTextColor={'#000'}
            textAlignVertical={'top'}
          />

        </View>

        <View style={{ marginTop: 20, marginLeft: 30, marginRight: 30, borderRadius: 5, backgroundColor: colorTheme.backGroundColor, }}>
          <View style={{ height: 140, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={() => { openCamera('1') }} style={{ width: '49%', height: '100%', backgroundColor: '#fff' }}>
              <Image source={image1 != '' ? { uri: image1 } : Images.uploadPlaceholder} style={styles.cardIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { openCamera('2') }} style={{ width: '49%', height: '100%', backgroundColor: '#fff' }}>
              <Image source={image2 != '' ? { uri: image2 } : Images.uploadPlaceholder} style={styles.cardIcon} />
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 5, height: 140, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={() => { openCamera('3') }} style={{ width: '49%', height: '100%', backgroundColor: '#fff' }}>
              <Image source={image3 != '' ? { uri: image3 } : Images.uploadPlaceholder} style={styles.cardIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { openCamera('4') }} style={{ width: '49%', height: '100%', backgroundColor: '#fff' }}>
              <Image source={image4 != '' ? { uri: image4 } : Images.uploadPlaceholder} style={styles.cardIcon} />
            </TouchableOpacity>
          </View>

        </View>



        {/* button */}
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity
            onPress={() => { addExpense_function() }}
            style={{ height: 48, backgroundColor: colorTheme.headerColor, marginBottom:20, marginLeft: 30, marginRight: 30, borderRadius: 5, flexDirection: 'column', justifyContent: 'center' }}
          >
            {loadingValue
              ?
              <ActivityIndicator
                animating={true}
                hidesWhenStopped={true}
                color={colorTheme.whiteColor}
              ></ActivityIndicator>
              :
              <Text style={{ textAlign: 'center', color: '#fff', fontFamily: FontFamily.medium }}>Submit</Text>
            }
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
};

//make this component available to the app
export default AddExpanseScreen;
