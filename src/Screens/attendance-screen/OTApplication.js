import React, { Component, useState, useEffect } from 'react';
import {
  View, Text, Image,
  StyleSheet, TouchableOpacity, FlatList,
  SafeAreaView, ToastAndroid, ActivityIndicator, Modal, Alert, PermissionsAndroid, Linking
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';

//Appearance
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../Constants/Theme/Theme';
import { ScreenLayout } from '../../Components';
import { Icons, Images } from '../../Constants/ImageIconContant';
import { FontFamily, FontSize } from '../../Constants/Fonts';
import HelperFunctions from '../../Constants/HelperFunctions';

//Plugin Import
import DatePicker from 'react-native-date-picker'
import GetLocation from 'react-native-get-location'
import { useDispatch, useSelector } from 'react-redux';
import { getDataWithToken, postWithToken } from '../../Service/service';
import Geolocation from 'react-native-geolocation-service'
import {
  localstorage_CompanyDetailsAdd, localstorage_EmployeeApiUrlAdd,
  localstorage_EmployeeDetailsAdd, localstorage_TokenAdd, clearEmpAndCompanyDetails
} from '../../Store/Reducers/CommonReducer';
import { deleteData, getData } from '../../Service/localStorage';

import Styles from './Style';
import { seAttendance, clearAttendance } from '../../Store/Reducers/AttendanceReducer';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';

// create a component
const OTApplication = props => {

  const { colorTheme } = useTheme();
  const styles = Styles();

  // Use for calender
  const [date, setDate] = useState(new Date());

  // Current Date time
  const [fullDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  //Calender date for filter
  const [toDate, setToDate] = useState("");
  const [fromDate, setFromDate] = useState("");

  // Calender open close flag
  const [toCalenderOpen, setToCalenderOpen] = useState(false);
  const [fromCalenderOpen, setFromCalenderOpen] = useState(false);

  // For loading purpose
  const [btnLoadingValue, btnSetLoading] = React.useState(false);
  // For Clock out loading purpose
  const [btnClockoutLoadingValue, btnSetClockoutLoading] = React.useState(false);

  //Attendance Action
  const [inTime, setinTime] = useState("N/A");
  const [outTime, setoutTime] = useState("N/A");

  // Redux 
  const dispatch = useDispatch();
  const { employeeDetails, employeeApiUrl, token } = useSelector(state => state.common);
  const { attendenceData } = useSelector(state => state.attendence);
  const isFocused = useIsFocused();

  const [loader, setloader] = React.useState(false);
  const [otList, setOtList] = React.useState("");
  const [actionType, selectActionType] = React.useState("");
  const [actionModal, setactionModal] = React.useState("");
  const [selectedItem, setselectedItem] = React.useState("");


  const calculateDateDifference = (startDate, endDate) => {
    // Ensure the dates are valid Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Invalid date(s) provided');
    }

    // Calculate the difference in milliseconds
    const differenceInMillis = end - start;

    // Convert milliseconds to days
    const differenceInDays = differenceInMillis / (1000 * 60 * 60 * 24);

    return Math.floor(differenceInDays); // Use Math.floor to get the whole number of days
  };

  useEffect(() => {
    if (isFocused == true) {
      setInterval(() => {
        getCurrentDateTime();
        //
      }, 1)
      // ======= Set default date to calender input =======
      getCurrentDate();
      setinTime("N/A");
      setoutTime("N/A");
    }
  }, [isFocused])



  /* == Fetch attendence Data ==*/
  const fetchAttendenceData = (paramData) => {
    const startDate = (paramData?.FromDate).toString(); // Format YYYY-MM-DD
    const endDate = (paramData?.ToDate).toString();   // Format YYYY-MM-DD
    const daysDifference = HelperFunctions.calculateDateDifference(startDate, endDate);
    if (daysDifference <= 7) {
      setloader(true)
      console.log("Attendance param", paramData)
      postWithToken(employeeApiUrl, 'MyOTInfo', paramData)
        .then((resp) => {
          setloader(false)
          console.log("resp data : ", resp.Data);
          if (resp.Status == true) {
            if (resp.Data) {

              console.log(resp?.Data)
              setOtList(resp.Data)
            } else { setOtList([]) }
          } else {
            setOtList([])
            showMsg(resp.msg)
          }
        })
        .catch((error) => {
          setloader(false)
          console.log("Attendance api error : ", error)
        })
    } else {
      showMsg("Date range should be between 7 days")
    }
  }

  const applyAction = () => {
    setactionModal(false)
    if (actionType != "") {
      let paramData = {
        EmployeeId: employeeDetails?.EmployeeId,
        Token: token,
        "OTAuthorizationId": selectedItem?.OTAuthorizationId,
        "AttendanceDate": selectedItem?.AttendanceDate,
        "IsOT": actionType,
        FromDate: fromDate,
        ToDate: toDate

      }
      setloader(true)
      console.log("Attendance param", paramData)
      postWithToken(employeeApiUrl, 'OTApplication', paramData)
        .then((resp) => {
          setloader(false)
          console.log("resp data : ", resp);
          if (resp.Status == true) {
            if (resp.Data) {
              showMsg(resp.msg);
              setselectedItem("");
              selectActionType("");
              setOtList(resp.Data)
            } else {
              showMsg(resp.msg);
              setselectedItem("");
              selectActionType("");

            }
          } else {
            showMsg(resp.msg);
            setselectedItem("");
            selectActionType("");
          }
        })
        .catch((error) => {
          setloader(false);
          setselectedItem("");
          selectActionType("");
          console.log("OT Attendance api error : ", error)
        })
    }
  }

  const availOT = (item) => {
    setactionModal(true);
    setselectedItem(item)
  }

  // ====== Get Current date and time function ======
  const getCurrentDateTime = (() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    let fullDate = dd + '-' + mm + '-' + yyyy;
    let currTime = ("0" + today.getHours()).slice(-2) + ":" + ("0" + today.getMinutes()).slice(-2) + ":" + ("0" + today.getSeconds()).slice(-2);
    setCurrentTime(currTime);
    setCurrentDate(fullDate);
  })

  const getCurrentDate = (() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    let calenderDate = yyyy + '/' + mm + '/' + dd
    setToDate(calenderDate);
    setFromDate(calenderDate);
    let paramData = {
      EmployeeId: employeeDetails?.EmployeeId,
      FromDate: calenderDate,
      ToDate: calenderDate,
      // "FromDate": "2024/07/01",
      // "ToDate": "2024/07/07",
      Token: token
    }
    fetchAttendenceData(paramData);  //Fetch attendence related Data
    //fetchTodayAttendance(paramData)
  })

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


  /*== Logout Button click function === */
  const singOutBtn = () => {
    showConfirmDialog("Logout", "Are you sure you want to logout from this app?", "Logout", "LOGOUT")
  }

  /* == Show Toast msg function == */
  const showMsg = (msg) => {
    Snackbar.show({
      text: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

  /*== Logout functionality start === */
  const singOutFunc = () => {
    dispatch(clearEmpAndCompanyDetails())
    deleteData();
    setTimeout(() => {
      props.navigation.replace('CompanyLogin');
    }, 400);
  }

  /* == Show logout confirmation alert ==*/
  const showConfirmDialog = (title, body, actionText, type) => {
    return Alert.alert(
      title,
      body,
      [
        {
          text: actionText, onPress: () => {
            type == 'LOGOUT' ? singOutFunc() : BackHandler.exitApp();
          },
        },
        {
          text: "Cancel",
        },
      ]
    );
  };




  // ============= Attendence summary item component ================
  const renderItem = ({ item }) => (

    <View style={styles.listContainer}>
      <View style={styles.listWrapper}>
        <View style={styles.listHeaderMian}>
          <View style={styles.dateContainer}>
            <Icon name="calendar" size={18} color={colorTheme.blackColor} />
            <Text style={styles.summaryDate}>
              {item?.AttendanceDate}
            </Text>
          </View>

          {item?.ApplicationStatus == "Pending" || item?.ApplicationStatus == "" ?
            <TouchableOpacity onPress={() => {
              availOT(item);
            }} style={[styles.dateContainer, { backgroundColor: colorTheme.headerColor, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 4 }]}>
              <Text style={[styles.summaryDate, { color: '#fff', fontFamily: FontFamily.medium }]}>
                Action
              </Text>
            </TouchableOpacity> : null}

          {item?.ApplicationStatus == "Approved" ?
            <View style={styles.dateContainer}>
              <Icon name="checkmark-circle" size={18} color={colorTheme.sucessColor} />
              <Text style={[styles.summaryDate, { color: colorTheme.sucessColor }]}>
                {item?.ApplicationStatus}
              </Text>
            </View> : null}

          {item?.ApplicationStatus == "Rejected" ?
            <View style={styles.dateContainer}>
              <Icon name="close-circle" size={18} color={colorTheme.errorColor} />
              <Text style={[styles.summaryDate, { color: colorTheme.errorColor }]}>
                {item?.ApplicationStatus}
              </Text>
            </View> : null}
        </View>
        <View style={styles.lineItemMain}>
          <View style={styles.itemKeyMain}>
            <Text style={[styles.keyName, { marginLeft: 0 }]}>
              {item?.EmployeeName ? item.EmployeeName : 'N/A'} ({item?.EmployeeNo ? item.EmployeeNo : 'N/A'})
            </Text>
          </View>

        </View>
        <View style={styles.lineItemMain}>
          <View style={styles.itemKeyMain}>
            <View style={[styles.bullet, { backgroundColor: colorTheme.sucessColor }]}></View>
            <Text style={styles.keyName}>
              In Time
            </Text>
          </View>
          <Text style={styles.keyValue}>
            {item?.InTime ? item.InTime : '-:-'}
          </Text>
        </View>

        <View style={styles.lineItemMain}>
          <View style={styles.itemKeyMain}>
            <View style={[styles.bullet, { backgroundColor: colorTheme.sucessColor }]}></View>
            <Text style={styles.keyName}>
              Out Time
            </Text>
          </View>
          <Text style={styles.keyValue}>
            {item?.OutTime ? item.OutTime : '-:-'}
          </Text>
        </View>


        <View style={styles.lineItemMain}>
          <View style={styles.itemKeyMain}>
            <View style={[styles.bullet, { backgroundColor: colorTheme.errorColor }]}></View>
            <Text style={styles.keyName}>
              Shift
            </Text>
          </View>
          <Text style={styles.keyValue}>
            {item?.Shift ? item.Shift : '-'}
          </Text>
        </View>
        <View style={styles.lineItemMain}>
          <View style={styles.itemKeyMain}>
            <View style={[styles.bullet, { backgroundColor: colorTheme.lightBlue }]}></View>
            <Text style={styles.keyName}>
              OT
            </Text>
          </View>
          <Text style={styles.keyValue}>
            {item?.OT ? item.OT : '-'}
          </Text>
        </View>
        {item?.IsOT != "-1" ?
          <View style={styles.lineItemMain}>
            <View style={styles.itemKeyMain}>
              <View style={[styles.bullet, { backgroundColor: colorTheme.lightBlue }]}></View>
              <Text style={styles.keyName}>
                Application type
              </Text>
            </View>
            <Text style={styles.keyValue}>
              {item?.IsOT == "1" ? "OT" : item?.IsOT == "0" ? "C-Off" : null}
            </Text>
          </View>
          : null}

        {item?.ApplicationStatus == "Pending" ?
          <View style={styles.lineItemMain}>
            <View style={styles.itemKeyMain}>
              <View style={[styles.bullet, { backgroundColor: colorTheme.lightBlue }]}></View>
              <Text style={styles.keyName}>
                Application Status
              </Text>
            </View>
            <Text style={styles.keyValue}>
              {item?.ApplicationStatus ? item.ApplicationStatus : '-'}
            </Text>
          </View> : null}

      </View>
    </View>
  );

  return (
    <ScreenLayout
      isHeaderShown={true}
      isShownHeaderLogo={false}
      headerTitle="OT Application"
      headerbackClick={() => {
        dispatch(clearAttendance())
        props.navigation.goBack()
      }}
      hamburgmenuVisable={false}
      // headermenuClick = {()=>{props.navigation.dispatch(DrawerActions.openDrawer())}}
      showpowerButton={true}
      clickPowerbutton={() => { singOutBtn() }}
    >
      <View style={styles.container}>
        <View style={styles.ProfileCard}>
          <Image source={Images.dummy_user_image} style={styles.profileImage} />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>
              {employeeDetails?.EmployeeName}
            </Text>
            <Text style={styles.time}>
              {fullDate}  | {currentTime}
            </Text>
            {/* <Text style={styles.officeTime}>
              Office Time - 10:30:00-18:30:00
            </Text> */}
          </View>
        </View>



        {/* From datepicker */}

        <View style={styles.menuCard}>
          <View style={styles.menuWrapper}>
            <Text style={{ color: colorTheme.blackColor }}>Search</Text>
            <TouchableOpacity
              style={styles.toDateMain}
              onPress={() =>
                setFromCalenderOpen(true)
              }
            >
              <Icon name="calendar" size={18} color={colorTheme.blackColor} />
              <Text style={styles.toDateLabel}>{fromDate}</Text>
            </TouchableOpacity>

            <DatePicker
              modal
              open={fromCalenderOpen}
              date={new Date()}
              mode="date"
              androidVariant="nativeAndroid"
              textColor="#093b85"
              cancelText="Close"
              onConfirm={(selectedDate) => {
                setFromCalenderOpen(false);
                setFromDate(formatDate(selectedDate));
                let paramData = {
                  EmployeeId: employeeDetails?.EmployeeId,
                  FromDate: formatDate(selectedDate),
                  ToDate: toDate,
                  Token: token
                }
                fetchAttendenceData(paramData)
              }}
              onCancel={() => {
                setFromCalenderOpen(false);
              }}
            />

            <TouchableOpacity
              onPress={() => setToCalenderOpen(true)}
              style={styles.fromDateMain}>
              <Icon name="calendar" size={18} color={colorTheme.blackColor} />
              <Text style={styles.fromDate}>{toDate}</Text>
            </TouchableOpacity>

            <DatePicker
              modal
              open={toCalenderOpen}
              date={new Date()}
              mode="date"
              androidVariant="nativeAndroid"
              textColor="#093b85"
              cancelText="Close"

              onConfirm={(selectedDate) => {
                setToCalenderOpen(false);
                setToDate(formatDate(selectedDate));
                let paramData = {
                  EmployeeId: employeeDetails?.EmployeeId,
                  FromDate: fromDate,
                  ToDate: formatDate(selectedDate),
                  Token: token
                }
                fetchAttendenceData(paramData)
              }}
              onCancel={() => {
                setToCalenderOpen(true);
              }}
            />
          </View>

          {/* Attendance list */}
          {otList != '' ? <SafeAreaView style={{ width: '100%' }}>
            <FlatList
              // data={DATA}
              data={otList}
              renderItem={renderItem}
              // keyExtractor={(item, index) => item.id}
              keyExtractor={(item, index) => index}
              contentContainerStyle={{ paddingBottom: 140 }}
            />

          </SafeAreaView> : <Text style={{ marginTop: 80, fontSize: FontSize.f15 }}>Sorry! No Result Found</Text>}
        </View>
      </View>
      <Modal
        transparent={true}
        animationType={'none'}
        visible={loader}
        style={{ zIndex: 1100 }}
        onRequestClose={() => { }}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator animating={loader} color="black" size={30} />
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        animationType={'none'}
        visible={actionModal}
        style={{ zIndex: 1100 }}
        onRequestClose={() => { }}>
        <View style={styles.modalBackground}>

          <View style={styles.optionModal}>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
              <Text style={[styles.summaryDate, { color: colorTheme.blackColor, textTransform: 'capitalize' }]}>
                Select
              </Text>
              <Icon name="close" size={18} color={colorTheme.blackColor} onPress={() => {
                setactionModal(false)
                selectActionType('')
              }} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', marginTop: 30, marginBottom: 12 }}>

              <Pressable onPress={() => { selectActionType('1') }} style={[styles.dateContainer]}>
                {actionType == "1" ?
                  <Icon name="checkmark-circle" size={26} color={colorTheme.blackColor} />
                  :
                  <Icon name="radio-button-off-sharp" size={26} color={colorTheme.blackColor} />

                }
                <Text style={[styles.summaryDate, { color: colorTheme.blackColor, textTransform: 'uppercase', fontSize: 14 }]}>
                  OT
                </Text>
              </Pressable>

              <Pressable onPress={() => { selectActionType('0') }} style={styles.dateContainer}>
                {actionType == "0" ?
                  <Icon name="checkmark-circle" size={26} color={colorTheme.blackColor} />
                  :
                  <Icon name="radio-button-off-sharp" size={26} color={colorTheme.blackColor} />

                }
                <Text style={[styles.summaryDate, { color: colorTheme.blackColor, textTransform: 'uppercase', fontSize: 14 }]}>
                  C-Off
                </Text>
              </Pressable>
            </View>
            {actionType != "" ?
              <TouchableOpacity onPress={() => { applyAction() }} style={{ height: 40, backgroundColor: '#299c71', marginLeft: 30, marginRight: 30, borderRadius: 5, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 22 }}>
                <Text style={{ textAlign: 'center', color: '#fff', fontFamily: FontFamily.medium }}>Apply</Text>
              </TouchableOpacity> : null}
          </View>
        </View>
      </Modal>
    </ScreenLayout>
  );
};

//make this component available to the app
export default OTApplication;
