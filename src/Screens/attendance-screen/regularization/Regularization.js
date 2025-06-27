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
import { postWithToken } from '../../../Service/service';
import { DashDetails } from '../Screens';
import Snackbar from 'react-native-snackbar';
import { useTheme } from '../../../Constants/Theme/Theme';
import RegularizationStyle from './Style';
import { ScreenLayout } from '../../../Components';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { Images } from '../../../Constants/ImageIconContant';
import Icon from 'react-native-vector-icons/Ionicons';
import { FontFamily } from '../../../Constants/Fonts';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

// create a component
const Regularization = props => {
  const { colorTheme } = useTheme()
  const styles = RegularizationStyle();
  const dispatch = useDispatch();
  const { count } = useSelector(state => state.common);

  const [attendanceType, setAttendanceType] = useState("");

  const [showAttendanceDateCalender, setattendanceDateCalender] = useState(false);
  const [showAttendanceTimeCalender, setattendanceTimeCalender] = useState(false);



  const { employeeDetails, employeeApiUrl, token } = useSelector(state => state.common);

  // params list
  const [attendanceDate, setattendanceDate] = useState("");
  const [attendanceTime, setattendanceTime] = useState("");
  const [Remarks, setRemarks] = useState('');
  const [loadingValue, setloadingValue] = useState(false);


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
  });

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatTime12Hour = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 24-hour format to 12-hour format
    return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };


  const addExpense_function = () => {
    if (!attendanceType) {
      showMsg("IO type can\'t be blank")
    } else if (!attendanceDate) {
      showMsg("Punch date can\'t be blank")
    }else if (!attendanceTime) {
      showMsg("Punch time can\'t be blank")
    } else if (!Remarks) {
      showMsg("Reason can\'t be blank")
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
      IOType:attendanceType,
      Edate: formatDate(new Date(attendanceDate)),
      Etime: formatTime(new Date(attendanceTime)),
      Reason: Remarks
    }

    //uploadFile(employeeApiUrl, '/MyExpenseInsert', paramData)
    postWithToken(employeeApiUrl, '/AttendanceApplicationInsert', paramData)
      .then((resp) => {
        console.log("AttendanceApplicationInsert : ", resp)
        setloadingValue(false);
        if (resp.Status == true) {
          showMsg(resp.msg);
          setattendanceDate("");
          setattendanceTime("");
          setRemarks("");
          setAttendanceType("")
        } else {
          showMsg(resp.msg);
        }
      })
      .catch((error) => {
        setloadingValue(false);
        console.log("Attendance Application api error : ", error)
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
      headerTitle="Attendance Application"
      headerbackClick={() => { props.navigation.goBack() }}

    >
      <ScrollView style={{ backgroundColor:'#fff', borderTopLeftRadius: 12,
      borderTopRightRadius: 12, }}>

      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',marginTop:15 }}>
          <TouchableOpacity onPress={()=>{setAttendanceType("0")}} style={{paddingHorizontal:28, borderWidth: 0.4, marginTop: 20, marginLeft: 30, marginRight: 0, borderRadius: 5, backgroundColor: attendanceType == "0" ? colorTheme.headerColor:'#fff', paddingVertical: 8 }}>
          <Text style={{ fontFamily: FontFamily.medium, color: attendanceType == "0" ? '#fff' : 'grey' }}>IN</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{setAttendanceType("1")}} style={{paddingHorizontal:25,  borderWidth: 0.4, marginTop: 20, marginLeft: 15, borderRadius: 5, backgroundColor:  attendanceType == "1" ? colorTheme.headerColor :'#fff', paddingVertical: 8 }}>
          <Text style={{ fontFamily: FontFamily.medium, color: attendanceType == "1" ? '#fff' : 'grey' }}>OUT</Text>
          </TouchableOpacity>
        </View>


        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }} >
          <View style={{ flex: 1, height: 40, flexDirection: 'row', marginLeft: 30, marginRight: 30, justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                onPress={() => setattendanceDateCalender(true)}
                style={{
                  flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: '#fff',
                  borderWidth: 0.4,
                  padding: 10, borderRadius: 5
                }}>
                <View>
                  <Icon name="calendar-outline" size={18} color="#696969" />
                </View>
                <View style={{ flexDirection: 'column', justifyContent: 'center', paddingLeft: 5 }}>
                  <Text style={{ fontFamily: FontFamily.medium, color: attendanceDate ? '#000' : 'grey' }}>{attendanceDate ? formatDate(new Date(attendanceDate)) : 'Punch Date'}</Text>
                </View>
              </TouchableOpacity>

              <DatePicker
                modal
                open={showAttendanceDateCalender}
                date={attendanceDate != "" ? new Date(attendanceDate) : new Date()}
                mode="date"
                theme="light"
                androidVariant="nativeAndroid"
                textColor="#093b85"
                cancelText="Close"
                maximumDate={new Date()}
                onConfirm={(selectedDate) => {
                 console.log("selectedDate ======>")
                  const tempDate = formatDate(selectedDate)
                  setattendanceDate(selectedDate.toISOString());
                  setattendanceDateCalender(false);
                }}
                onCancel={() => {
                  setattendanceDateCalender(false);
                }}
              />
            </View>
          </View>
        </View>


        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }} >
          <View style={{ flex: 1, height: 40, flexDirection: 'row', marginLeft: 30, marginRight: 30, justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                onPress={() => setattendanceTimeCalender(true)}
                style={{
                  flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: '#fff',
                  borderWidth: 0.4,
                  padding: 10, borderRadius: 5
                }}>
                <View>
                  <Icon name="calendar-outline" size={18} color="#696969" />
                </View>
                <View style={{ flexDirection: 'column', justifyContent: 'center', paddingLeft: 5 }}>
                  <Text style={{ fontFamily: FontFamily.medium, color: attendanceDate ? '#000' : 'grey' }}>{attendanceTime ? formatTime12Hour(new Date(attendanceTime)) : 'Punch Time'}</Text>
                </View>
              </TouchableOpacity>

              <DatePicker
                modal
                open={showAttendanceTimeCalender}
                date={attendanceTime != ""? new Date(attendanceTime) : new Date()}
                mode="time"
                locale='en'
                theme="light"
                androidVariant="nativeAndroid"
                textColor="#093b85"
                cancelText="Close"
                onConfirm={(selectedTime) => {
                  console.log("selected time ======>")
                
                //console.log(selectedDate.toLocaleTimeString('en-GB'))
                console.log(selectedTime)
                   setattendanceTime(selectedTime.toISOString());
                   setattendanceTimeCalender(false);
                }}
                onCancel={() => {
                  setattendanceTimeCalender(false);
                }}
              />
            </View>
          </View>
        </View>

        <View style={{ borderWidth: 0.4, marginTop: 20, marginLeft: 30, marginRight: 30, borderRadius: 5, backgroundColor: '#fff', }}>
          <TextInput
            // style={styles.input}
            style={{ height: 100, color: 'black', justifyContent: 'flex-start', paddingLeft: 10, fontFamily: FontFamily.medium }}
            multiline={true}
            onChangeText={text => setRemarks(text)}
            value={Remarks}
            placeholder={"Reason"}
            //placeholderTextColor={'#000'}
            textAlignVertical={'top'}
          />

        </View>


        {/* button */}
        <View style={{ marginTop: 30 }}>
          <TouchableOpacity
            onPress={() => { addExpense_function() }}
            style={{ height: 48, backgroundColor: colorTheme.headerColor, marginLeft: 30, marginRight: 30, borderRadius: 5, flexDirection: 'column', justifyContent: 'center' }}
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
export default Regularization;
