import React, { Component, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  ToastAndroid,
  ActivityIndicator,
  Image
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { DashDetails } from '../Screens';
import { getDataWithOutToken, postWithToken } from '../../Service/service';
import { useTheme } from '../../Constants/Theme/Theme';
import Styles from './Style';
import { ScreenLayout } from '../../Components';

import ActionSheet from "react-native-actions-sheet";
import { useIsFocused } from '@react-navigation/native';
import { setleaveBalance, setLeaveTypesReducers, clearLeaveTypesReducers } from '../../Store/Reducers/LeaveReducer';
import Icon from 'react-native-vector-icons/Ionicons';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { Images } from '../../Constants/ImageIconContant';
import { FontFamily } from '../../Constants/Fonts';
import Snackbar from 'react-native-snackbar';

// create a component
const ApplyLeaveScreen = props => {
  const { colorTheme } = useTheme()
  const styles = Styles();
  const dispatch = useDispatch();
  const { count } = useSelector(state => state.common);
  const actionSheetRef = useRef(null);


  const { employeeDetails, employeeApiUrl, token } = useSelector(state => state.common);
  const { leaveBalance, leaveTypesdata } = useSelector(state => state.leave);
  const isFocused = useIsFocused();

  const [selectedLeaveType, setLeaveType] = useState();
  const [showStartDateCalender, setStartDateCalender] = useState(false);
  const [showEndtDateCalender, setEndtDateCalender] = useState(false);
  const [startDateValue, setStartDate] = useState("");
  const [endDateValue, setEndDate] = useState("");
  const [showleaveConsumeBar, setleaveConsumeBar] = useState(false);
  const [leaveConsumeBarData, setleaveConsumeBarData] = useState("");

  const [leaveConsumeType, setleaveConsumeType] = useState('fullday');
  const [leaveConsumeSubType, setleaveConsumeSubType] = useState('');
  const [leaveConsumeId, setleaveConsumeId] = useState('');

  // params list
  const [reasonvalue, setReasonvalue] = useState('');
  const [loadingValue, setloadingValue] = useState(false);

  // const [modalVisible, setModalVisible] = useState(false);



  /* == Show Toast msg function == */
  const showMsg = (msg) => {
    Snackbar.show({
      text: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }


  useEffect(() => {
    fetchLeaveBalance();
    // const dd = moment().subtract(0, 'days')
    // console.log("csdcsd" , dd)
  }, [isFocused])

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

  fetchLeaveBalance = () => {
    let paramData = {
      // EmployeeId: employeeDetails?.EmployeeId,
      Token: token
    }
    postWithToken(employeeApiUrl, 'LeaveTypeSelectAll', paramData)
      .then((resp) => {
        console.log("LeaveTypeSelectAll : ", resp.Data);
        if (resp.Status == true) {
          // showMsg(resp.msg);
          if (resp.Data) {
            console.log("Leave Balance data ===> ", resp?.Data);
            dispatch(setLeaveTypesReducers(resp.Data))
            setTimeout(() => {
              console.log("leaveTypes : ", leaveTypesdata);
            }, 5000);
            //setModalVisible(!modalVisible);
          } else { dispatch(clearLeaveTypesReducers()) }
        } else {
          dispatch(clearLeaveTypesReducers())
          showMsg(resp.msg)
        }
      })
      .catch((error) => {
        console.log("Leave balance api error : ", error)
      })
  }

  const clickOptionsheet = (item) => {
    console.log("Item : ", item)
    setLeaveType(item);
    // setTimeout(() => {
    actionSheetRef.current?.hide();
    setleaveConsumeType('fullday');
    setleaveConsumeId('');
    // }, 1000);
  }

  /* == Apply leave function == */
  const applyLeave_function = () => {
    console.log(startDateValue.replace(/\//g, "-"))
    console.log(endDateValue.replace(/\//g, "-"))
    if (!selectedLeaveType?.AttendanceCode) {
      showMsg("Leave type can not be blank")
    } else if (!startDateValue || !endDateValue) {
      if (!startDateValue) {
        showMsg("Start date cannot be blank")
      } else if (!endDateValue) {
        showMsg("End date can not be blank")
      }
    } else if (!reasonvalue) {
      showMsg("Leave reason can not be blank")
    } else {
      console.log("Alll data are submited", selectedLeaveType);
      var start = moment(startDateValue.replace(/\//g, "-"));
      var end = moment(endDateValue.replace(/\//g, "-"));
      let dateDiffResult = end.diff(start, "days");
      console.log(dateDiffResult)
      if (dateDiffResult >= 0) {
        setloadingValue(true);
        setTimeout(() => {
          submitLeaveApplication()
        }, 1000);
      } else {
        showMsg("Sorry! You can\'t apply leave to this date range")
      }
      // LeaveApplicationInsert
    }
  }


  // const checkLeaveConsume = (absentType) => {
  //   // alert(selectedLeaveType.AttendanceStatusMasterId)
  //   setloadingValue(true);
  //   let paramData = {
  //     LeaveTypeId: selectedLeaveType.AttendanceStatusMasterId,
  //     IsFirstHalfAbsent: absentType,
  //   }

  //   console.log(paramData)
  //   postWithToken(employeeApiUrl, '/GetHalfLeaveId', paramData)
  //     .then((resp) => {
  //       console.log("LeaveApplicationInsert : ", resp)
  //       setloadingValue(false);
  //       if (resp.Status == true) {
  //         //showMsg(resp.msg);
  //         console.log(resp?.Data[0]?.LeaveTypeId)
  //         setleaveConsumeId(resp?.Data[0]?.LeaveTypeId);
  //       } else {
  //         showMsg(resp.msg);
  //         setleaveConsumeType('fullday');
  //         setleaveConsumeId('');

  //       }
  //     })
  //     .catch((error) => {
  //       setloadingValue(false);
  //       console.log("Leave balance api error : ", error)
  //     })
  // }

  const checkLeaveConsume = (absentVal, absentType) => {
    console.log(selectedLeaveType)
    if (selectedLeaveType.AttendanceStatusMasterId) {
      console.log(absentVal, absentType)
      // alert(selectedLeaveType.AttendanceStatusMasterId)
      setloadingValue(true);
      let paramData = {
        LeaveTypeId: selectedLeaveType.AttendanceStatusMasterId,
        IsFirstHalfAbsent: absentType == 'halfday' ? absentVal : 0,
        Quarter: absentType == 'quaterday' ? absentVal : 0
      }

      console.log(paramData)
      postWithToken(employeeApiUrl, '/GetHalfQuarterLeaveId', paramData)
        .then((resp) => {
          console.log("LeaveApplicationInsert : ", resp)
          setloadingValue(false);
          if (resp.Status == true) {
            //showMsg(resp.msg);
            console.log(resp?.Data[0]?.LeaveTypeId)
            setleaveConsumeId(resp?.Data[0]?.LeaveTypeId);
          } else {
            showMsg(resp.msg);
            setleaveConsumeType('fullday');
            setleaveConsumeId('');
            setleaveConsumeSubType('');

          }
        })
        .catch((error) => {
          setloadingValue(false);
          console.log("Leave balance api error : ", error)
        })
    }
  }

  const submitLeaveApplication = () => {
   
    let paramData = {
      EmployeeId: employeeDetails?.EmployeeId,
      Token: token,
      // LeaveTypeId:selectedLeaveType.AttendanceCode,
      LeaveTypeId: leaveConsumeId ? leaveConsumeId : selectedLeaveType.AttendanceStatusMasterId,
      ToDate: endDateValue,
      FromDate: startDateValue,
      Reason: reasonvalue
    }

    console.log(paramData)

    postWithToken(employeeApiUrl, '/LeaveApplicationInsert', paramData)
      .then((resp) => {
        console.log("LeaveApplicationInsert : ", resp)
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
        console.log("Leave balance api error : ", error)
      })
  }



  const fetchLeaveBar = () => {
    let paramData = {
      // EmployeeId: employeeDetails?.EmployeeId,
      Token: token
    }
    postWithToken(employeeApiUrl, 'LeaveDayTypeSearch', paramData)
      .then((resp) => {
        console.log(resp);
        setleaveConsumeBarData(resp)
        // if (resp.Status == true) {
        //   // showMsg(resp.msg);
        //   if (resp.Data) {
        //     console.log("Leave bar data ===> ", resp?.Data);

        //   } else { 

        //   }
        // } else {

        //   showMsg(resp.msg)
        // }
      })
      .catch((error) => {
        console.log("Leave balance api error : ", error)
      })
  }

  // const selectedLeaveConsume = (value) => {
  //   setleaveConsumeType(value);
  //   if (value != 'fullday') {
  //     //checkLeaveConsume(value == '1sthalf' ? 1 : 0)
  //   } else {
  //     setleaveConsumeId('');
  //   }
  // }


  const selectedLeaveConsume = (value) => {
    setleaveConsumeType(value);
    if (value == 'fullday') {
      setleaveConsumeId('');
    }
  }

  const selectedSubLeaveConsume = (value) => {
    setleaveConsumeSubType(value);
    if (value == '1sthalf') {
      checkLeaveConsume(1, 'halfday')
    } else if (value == '2ndhalf') {
      checkLeaveConsume(0, 'halfday')
    } else if (value == '1stq') {
      checkLeaveConsume(1, 'quaterday')
    } else if (value == '2ndq') {
      checkLeaveConsume(2, 'quaterday')
    } else if (value == '3rdq') {
      checkLeaveConsume(3, 'quaterday')
    } else if (value == '4thq') {
      checkLeaveConsume(4, 'quaterday')
    }

  }
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => { clickOptionsheet(item) }}>
      <View style={{ height: 60, width: 60, margin: 10, borderRadius: 5, borderWidth: 0.2, backgroundColor: 'white', borderColor: '#299c71', }}>
        {selectedLeaveType?.AttendanceCode == item.AttendanceCode ?
          <View style={{ width: 30, height: 30, borderRadius: 30, position: 'absolute', top: -2, right: -10 }}>
            <Icon name="checkmark-circle" size={20} style={{ color: colorTheme.headerColor }} />
          </View>
          : null
        }

        <View style={{ flexDirection: 'column', justifyContent: 'center', height: '100%', width: '100%' }}>
          <Text style={{ textAlign: 'center', fontSize: 20, color: colorTheme.headerColor, fontFamily: FontFamily.medium }}>{item?.AttendanceCode}</Text>
        </View>
      </View>
    </TouchableOpacity>

  );


  return (
    <ScreenLayout
      isHeaderShown={true}
      isShownHeaderLogo={false}
      headerTitle="Apply leave"
      headerbackClick={() => { props.navigation.goBack() }}>

      <ScrollView showsVerticalScrollIndicator={false}
        style={styles.mainView}>
        <ActionSheet ref={actionSheetRef} containerStyle={styles.actionsheetStyle}>
          <View style={{
            paddingLeft: 30, height: 50, borderBottomWidth: 2, borderBottomColor: '#fff',
            // backgroundColor:'#000',
            flexDirection: 'row',
            justifyContent: 'flex-start', borderTopLeftRadius: 10, borderTopRightRadius: 10
          }}>

            <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
              <Image source={Images.leaveApproveTask} style={styles.cardIcon} />
            </View>
            <View style={{ flexDirection: 'column', justifyContent: 'center', paddingLeft: 10 }}>
              <Text style={{ fontSize: 18, color: colorTheme.headerColor, fontFamily: FontFamily.medium }}>Select Leave type</Text>
            </View>
          </View>
          <FlatList
            data={leaveTypesdata}
            // data={actionData}

            renderItem={renderItem}
            keyExtractor={(item, index) => item}
            showsVerticalScrollIndicator={false}
            style={{ marginTop: 10, borderColor: '#004792', marginBottom: 10, display: 'flex', flexWrap: 'wrap' }}
            contentContainerStyle={{ width: '100%', marginLeft: '5%' }}
            numColumns={4}
          />
        </ActionSheet>


        <View style={{ marginTop: 20 }}>
          <TouchableOpacity
            onPress={() => actionSheetRef.current?.show()}
            style={{
              flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff',
              borderWidth: 0.4,
              padding: 10, marginLeft: 30, marginRight: 30, borderRadius: 5
            }}>
            <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
              <Text style={{ fontFamily: FontFamily.medium }}>{selectedLeaveType?.AttendanceCode ? selectedLeaveType.AttendanceCode : 'Leave type'}</Text>
            </View>
            <View>
              <Icon name="chevron-down" size={20} />
            </View>
          </TouchableOpacity>
        </View>
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
            console.log(new Date(selectedDate));
            const tempDate = formatDate(selectedDate)
            // const tempDate = new Date(selectedDate)
            setStartDate(tempDate);
            setStartDateCalender(false);
            if (tempDate == endDateValue) {
              setleaveConsumeBar(true);
              fetchLeaveBar()
            } else {
              setleaveConsumeBar(false);
              setleaveConsumeType('fullday');
              setleaveConsumeId('');

            }
          }}
          onCancel={() => {
            setStartDateCalender(false);
          }}
        />

        {/* End date calender */}
        <DatePicker
          modal
          open={showEndtDateCalender}
          date={new Date()}
          mode="date"
          androidVariant="nativeAndroid"
          textColor="#093b85"
          cancelText="Close"
          // minimumDate={moment().toDate()}
          // minimumDate={moment().subtract(0, 'days')}
          onConfirm={(selectedDate) => {
            const tempDate = formatDate(selectedDate)
            setEndDate(tempDate);
            setEndtDateCalender(false);
            console.log(tempDate)

            if (startDateValue == tempDate) {
              setleaveConsumeBar(true);
              fetchLeaveBar()
            } else {
              setleaveConsumeBar(false);
              setleaveConsumeType('fullday');
              setleaveConsumeId('');
            }
          }}
          onCancel={() => {
            setEndtDateCalender(false);
          }}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }} >
          <View style={{ flex: 1, height: 40, flexDirection: 'row', marginLeft: 30, marginRight: 30, justifyContent: 'space-between' }}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <TouchableOpacity
                // onPress={()=>actionSheetRef.current?.show()}
                onPress={() => setStartDateCalender(true)}
                style={{
                  flexDirection: 'row', justifyContent: 'center', backgroundColor: '#fff',
                  borderWidth: 0.4,
                  padding: 10, borderRadius: 5
                }}>
                <View>
                  <Icon name="calendar-outline" size={18} color="#696969" />
                </View>
                <View style={{ flexDirection: 'column', justifyContent: 'center', paddingLeft: 5 }}>
                  <Text style={{ fontFamily: FontFamily.medium }}>{startDateValue ? startDateValue : 'Start Date'}</Text>
                </View>

              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                onPress={() => setEndtDateCalender(true)}
                style={{
                  flexDirection: 'row', justifyContent: 'center', backgroundColor: '#fff',
                  borderWidth: 0.4,
                  padding: 10, borderRadius: 5
                }}>
                <View>
                  <Icon name="calendar-outline" size={18} color="#696969" />
                </View>
                <View style={{ flexDirection: 'column', justifyContent: 'center', paddingLeft: 5 }}>
                  <Text style={{ fontFamily: FontFamily.medium }}> {endDateValue ? endDateValue : 'End Date'}</Text>
                </View>

              </TouchableOpacity>
            </View>
          </View>
        </View>

        {showleaveConsumeBar ?
          // <View style={{ marginTop: 20, marginLeft: 30, marginRight: 28, }}>
          //   <View style={{ justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }}>

          //     <TouchableOpacity onPress={() => { selectedLeaveConsume('1sthalf') }} style={{ marginRight: 12, width: '30%', borderWidth: 1, borderColor: leaveConsumeType == '1sthalf' ? '#299c71' : '#bdbdbd', backgroundColor: leaveConsumeType == '1sthalf' ? '#299c71' : null, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 }}>
          //       <Text style={{ color: leaveConsumeType == '1sthalf' ? '#fff' : '#000', fontSize: 13, textAlign: 'center' }}>1st Half Absent</Text>
          //     </TouchableOpacity>
          //     <TouchableOpacity onPress={() => { selectedLeaveConsume('2ndhalf') }} style={{ marginRight: 12, width: '30%', borderWidth: 1, borderColor: leaveConsumeType == '2ndhalf' ? '#299c71' : '#bdbdbd', backgroundColor: leaveConsumeType == '2ndhalf' ? '#299c71' : null, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 }}>
          //       <Text style={{ color: leaveConsumeType == '2ndhalf' ? '#fff' : '#000', fontSize: 13, textAlign: 'center' }}>2nd Half Absent</Text>
          //     </TouchableOpacity>
          //     <TouchableOpacity onPress={() => { selectedLeaveConsume('fullday') }} style={{ marginRight: 12, width: '30%', backgroundColor: leaveConsumeType == 'fullday' ? '#299c71' : null, borderWidth: 1, borderColor: leaveConsumeType == 'fullday' ? '#299c71' : '#bdbdbd', paddingHorizontal: 12, paddingVertical: 16, borderRadius: 4 }}>
          //       <Text style={{ color: leaveConsumeType == 'fullday' ? '#fff' : '#000', fontSize: 13, textAlign: 'center' }}>Full Day</Text>
          //     </TouchableOpacity>
          //   </View>

          // </View> 

          <View style={{ marginTop: 20, marginLeft: 30, marginRight: 28, }}>
            <View style={{ justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }}>
              {leaveConsumeBarData?.IsFullDay == true ?
                <TouchableOpacity onPress={() => { selectedLeaveConsume('fullday') }} style={{ marginRight: 12, width: '28%', borderWidth: 1, borderColor: leaveConsumeType == 'fullday' ? '#299c71' : '#bdbdbd', backgroundColor: leaveConsumeType == 'fullday' ? '#299c71' : null, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 }}>
                  <Text style={{ color: leaveConsumeType == 'fullday' ? '#fff' : '#000', fontSize: 13, textAlign: 'center' }}> Full Day</Text>
                </TouchableOpacity> : null}

              {leaveConsumeBarData?.IsHalfDay == true && selectedLeaveType?.AttendanceCode != "SRL" ?
                <TouchableOpacity onPress={() => { selectedLeaveConsume('halfday') }} style={{ marginRight: 12, width: '28%', borderWidth: 1, borderColor: leaveConsumeType == 'halfday' ? '#299c71' : '#bdbdbd', backgroundColor: leaveConsumeType == 'halfday' ? '#299c71' : null, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 }}>
                  <Text style={{ color: leaveConsumeType == 'halfday' ? '#fff' : '#000', fontSize: 13, textAlign: 'center' }}>Half Day</Text>
                </TouchableOpacity> : null}

              {leaveConsumeBarData?.IsQuarter == true && selectedLeaveType?.AttendanceCode != "SRL" ?
                <TouchableOpacity onPress={() => { selectedLeaveConsume('quater') }} style={{ marginRight: 12, width: '35%', borderWidth: 1, borderColor: leaveConsumeType == 'quater' ? '#299c71' : '#bdbdbd', backgroundColor: leaveConsumeType == 'quater' ? '#299c71' : null, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 }}>
                  <Text style={{ color: leaveConsumeType == 'quater' ? '#fff' : '#000', fontSize: 13, textAlign: 'center' }}>Quarter Day</Text>
                </TouchableOpacity> : null}
            </View>

          </View>


          : null}

        {leaveConsumeType == 'halfday' && selectedLeaveType?.AttendanceCode != "SRL" ?
          <View style={{ marginTop: 20, marginLeft: 30, marginRight: 28, }}>
            <View style={{ justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => { selectedSubLeaveConsume('1sthalf') }} style={{ marginRight: 12, width: '40%', borderWidth: 1, borderColor: leaveConsumeSubType == '1sthalf' ? '#299c71' : '#bdbdbd', backgroundColor: leaveConsumeSubType == '1sthalf' ? '#299c71' : null, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 }}>
                <Text style={{ color: leaveConsumeSubType == '1sthalf' ? '#fff' : '#000', fontSize: 13, textAlign: 'center' }}>1st Half</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { selectedSubLeaveConsume('2ndhalf') }} style={{ marginRight: 12, width: '40%', borderWidth: 1, borderColor: leaveConsumeSubType == '2ndhalf' ? '#299c71' : '#bdbdbd', backgroundColor: leaveConsumeSubType == '2ndhalf' ? '#299c71' : null, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 }}>
                <Text style={{ color: leaveConsumeSubType == '2ndhalf' ? '#fff' : '#000', fontSize: 13, textAlign: 'center' }}>2nd Half</Text>
              </TouchableOpacity>

            </View>
          </View> : null}


        {leaveConsumeType == 'quater' && selectedLeaveType?.AttendanceCode != "SRL" ?
          <View style={{ marginTop: 20, marginLeft: 30, marginRight: 28, }}>
            <View style={{ justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }}>

              <TouchableOpacity onPress={() => { selectedSubLeaveConsume('1stq') }} style={{ marginRight: 12, width: '35%', borderWidth: 1, borderColor: leaveConsumeSubType == '1stq' ? '#299c71' : '#bdbdbd', backgroundColor: leaveConsumeSubType == '1stq' ? '#299c71' : null, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 }}>
                <Text style={{ color: leaveConsumeSubType == '1stq' ? '#fff' : '#000', fontSize: 13, textAlign: 'center' }}> 1st Quarter</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { selectedSubLeaveConsume('2ndq') }} style={{ marginRight: 12, width: '35%', borderWidth: 1, borderColor: leaveConsumeSubType == '2ndq' ? '#299c71' : '#bdbdbd', backgroundColor: leaveConsumeSubType == '2ndq' ? '#299c71' : null, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 }}>
                <Text style={{ color: leaveConsumeSubType == '2ndq' ? '#fff' : '#000', fontSize: 13, textAlign: 'center' }}>2nd Quarter</Text>
              </TouchableOpacity>
            </View>
            <View style={{ justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', marginTop: 12 }}>

              <TouchableOpacity onPress={() => { selectedSubLeaveConsume('3rdq') }} style={{ marginRight: 12, width: '35%', borderWidth: 1, borderColor: leaveConsumeSubType == '3rdq' ? '#299c71' : '#bdbdbd', backgroundColor: leaveConsumeSubType == '3rdq' ? '#299c71' : null, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 }}>
                <Text style={{ color: leaveConsumeSubType == '3rdq' ? '#fff' : '#000', fontSize: 13, textAlign: 'center' }}>3rd Quarter</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { selectedSubLeaveConsume('4thq') }} style={{ marginRight: 12, width: '35%', borderWidth: 1, borderColor: leaveConsumeSubType == '4thq' ? '#299c71' : '#bdbdbd', backgroundColor: leaveConsumeSubType == '4thq' ? '#299c71' : null, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 }}>
                <Text style={{ color: leaveConsumeSubType == '4thq' ? '#fff' : '#000', fontSize: 13, textAlign: 'center' }}>4th Quarter</Text>
              </TouchableOpacity>

            </View>
          </View> : null}


        <View style={{ borderWidth: 0.4, marginTop: 20, marginLeft: 30, marginRight: 30, borderRadius: 5, backgroundColor: '#fff', }}>
          <TextInput
            // style={styles.input}
            style={{ height: 100, color: 'black', justifyContent: 'flex-start', paddingLeft: 10, fontFamily: FontFamily.medium }}
            multiline={true}
            onChangeText={text => setReasonvalue(text)}
            value={reasonvalue}
            placeholder={"Reason"}
            placeholderTextColor={'#000'}
            textAlignVertical={'top'}

          />

        </View>
        {/* button */}
        <View style={{ marginTop: 30 }}>
          <TouchableOpacity
            onPress={() => { applyLeave_function() }}
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
              <Text style={{ textAlign: 'center', color: '#fff', fontFamily: FontFamily.medium }}>Apply leave</Text>
            }
          </TouchableOpacity>

        </View>

      </ScrollView>
    </ScreenLayout>
  );
};

//make this component available to the app
export default ApplyLeaveScreen;
