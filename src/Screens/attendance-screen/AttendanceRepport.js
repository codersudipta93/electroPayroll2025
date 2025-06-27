import React, { Component, useState, useEffect } from 'react';
import {
  View, Text, Image,
  StyleSheet, TouchableOpacity, FlatList,
  SafeAreaView, ToastAndroid, ActivityIndicator, Modal, Alert, PermissionsAndroid, Linking,
  Pressable
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';

//Appearance

import { useTheme } from '../../Constants/Theme/Theme';
import { Loader, ScreenLayout } from '../../Components';
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
import Icon from 'react-native-vector-icons/Ionicons';
import Styles from './Style';
import { seAttendance, clearAttendance } from '../../Store/Reducers/AttendanceReducer';
import { ConfirmationModal } from '../../Components/confirmationModal';

// create a component
const AttendanceRepport = props => {
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
 const [logoutModal, setLogoutModal] = React.useState(false);
  const [loader, setloader] = React.useState(false);
  // const locationServicesAvailable = await ConnectivityManager.areLocationServicesEnabled()

  // Check Location permission
  // const locationPermission = await ConnectivityManager.isLocationPermissionGranted()

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
      const startDate = '2024-08-01'; // Format YYYY-MM-DD
      const endDate = '2024-08-10';   // Format YYYY-MM-DD
      // const daysDifference = HelperFunctions.getDifferenceInDays(startDate, endDate);
      // alert(`Difference in days: ${daysDifference}`);

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




  /* == SET ATTENDANCE == */
  const setMobileAttendanceApi = (lat, long, type) => {
    // btnSetLoading(true);
    if (type == 'IN') {
      btnSetLoading(true);
    } else {
      btnSetClockoutLoading(true);
    }
    let paramData = {
      EmployeeId: employeeDetails?.EmployeeId,
      EntryType: type,
      Latitude: lat,
      Longitude: long,
      // Token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjAiLCJuYmYiOjE2NjQwOTc5NjAsImV4cCI6MTY2NDA5OTc2MCwiaWF0IjoxNjY0MDk3OTYwfQ.JU3Vj1xk3kCr4ig_cw8ofgoWgCZCyDWr6mRy0Z-nuAg"
      Token: token
    }
    postWithToken(
      employeeApiUrl, '/MobileAttendanceInsert',
      // JSON.stringify(paramData)
      paramData
    )
      .then((resp) => {
        // btnSetLoading(false);
        if (type == 'IN') {
          btnSetLoading(false);
        } else {
          btnSetClockoutLoading(false);
        }
        // console.log("resp : ", resp);
        if (resp.staus == true) {
          showMsg(resp.msg);
        } else {
          showMsg(resp.msg)
        }
      })
      .catch((error) => {
        // btnSetLoading(false);
        if (type == 'IN') {
          btnSetLoading(false);
        } else {
          btnSetClockoutLoading(false);
        }
        console.log("Attendance api error : ", error)
      })
  }

  /* == Fetch attendence Data ==*/
  const fetchAttendenceData = (paramData) => {
    const startDate = (paramData?.FromDate).toString(); // Format YYYY-MM-DD
    const endDate = (paramData?.ToDate).toString();   // Format YYYY-MM-DD
    const daysDifference = HelperFunctions.calculateDateDifference(startDate, endDate);
    if (daysDifference <= 7) {
      setloader(true)
      console.log("Attendance param", paramData)
      postWithToken(employeeApiUrl, '/MobileAttendanceSummary', paramData)
        .then((resp) => {
          setloader(false)
          console.log("resp data : ", resp.Data);
          if (resp.Status == true) {
            if (resp.Data) {
              dispatch(seAttendance(resp.Data))
            } else { dispatch(seAttendance([])) }
          } else {
            dispatch(seAttendance([]))
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


  fetchTodayAttendance = (paramData) => {
    console.log("Attendance param", paramData)
    postWithToken(employeeApiUrl, '/MobileAttendanceSummary', paramData)
      .then((resp) => {
        // btnSetLoading(false);
        console.log("todays Attendance status ===> ", resp);
        if (resp.Status == true) {
          // showMsg(resp.msg);
          if (resp.Data) {
            let data = resp.Data[0]
            setinTime(data?.InTime != "" ? data?.InTime : "N/A")
            setoutTime(data?.OutTime != "" ? data?.OutTime : "N/A");
          } else { dispatch(seAttendance([])) }
        } else {
          dispatch(seAttendance([]))
          //showMsg(resp.msg)
        }
      })
      .catch((error) => {
        console.log("Attendance api error : ", error)
      })
  }


  // async function requestLocationPermission() {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  //     )
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       console.log("You can use the location")
  //       alert("You can use the location");
  //       submitAttendence("IN")
  //     } else {
  //       console.log("location permission denied")
  //       requestLocationPermission()
  //       //alert( "Please go to app setting and give location permission" )
  //     }
  //   } catch (err) {
  //     console.warn(err)
  //   }
  // }

  const requestLocationPermission = async (attendenceType) => {
    // btnSetLoading(true);
    if (attendenceType == 'IN') {
      btnSetLoading(true);
    } else {
      btnSetClockoutLoading(true)
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log('granted', granted);
      if (granted === 'granted') {
        console.log('You can use Geolocation');
        return true;
      } else {
        console.log('You cannot use Geolocation');
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  // function to check permissions and get Location
  const submitAttendence = (TYPE) => {
    const result = requestLocationPermission(TYPE);
    result.then(res => {
      console.log('res is:', res);
      if (res) {

        Geolocation.getCurrentPosition(
          position => {
            let locationRes = position?.coords;
            console.log(locationRes);
            setMobileAttendanceApi(locationRes.latitude, locationRes.longitude, TYPE);
            getCurrentDate();// Fetch Attendance result
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);

          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );

      }
    });

  };



  //OLD =======
  // const submitAttendence = ((TYPE) => {

  //   /*  GetLocation.getCurrentPosition({
  //      // enableHighAccuracy: true,
  //       timeout: 20000,
  //     })
  //       .then(locationRes => {
  //         console.log(locationRes);
  //         //setMobileAttendanceApi(locationRes.latitude, locationRes.longitude, TYPE);
  //        // getCurrentDate();// Fetch Attendance result
  //       })
  //       .catch(error => {
  //         const { code, message } = error;
  //         if (code == "UNAVAILABLE") {
  //           alert("Please turn on your device location")
  //         } else if (code == "UNAUTHORIZED") {
  //           alert("Please go to app settings and give location permission")
  //         }
  //         else {
  //           alert(message)
  //         }

  //         console.log(code, message);
  //       })*/
  // })

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
      Token: token
    }
    fetchAttendenceData(paramData);  //Fetch attendence related Data
    fetchTodayAttendance(paramData)
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
     setLogoutModal(true)
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
          <Text style={styles.headerTitle}>
            Summary
          </Text>
          <View style={styles.dateContainer}>
            <Icon name="calendar" size={18} color={colorTheme.headerColor} />
            <Text style={styles.summaryDate}>
              {item?.Day ? item.Day : '-'}
            </Text>
          </View>
        </View>
        <View style={[styles.lineItemMain, { paddingTop: 8, paddingBottom: 8 }]}>
          <View style={styles.itemKeyMain}>
            <View style={[styles.bullet, { backgroundColor: colorTheme.sucessColor }]}></View>
            <Text style={styles.keyName}>
              In Time
            </Text>
          </View>
          <Text style={styles.keyValue}>
            {item?.InTime ? item.InTime : '-'}
          </Text>
        </View>
        <View style={[styles.lineItemMain, { paddingTop: 8, paddingBottom: 8 }]}>
          <View style={styles.itemKeyMain}>
            <View style={[styles.bullet, { backgroundColor: colorTheme.errorColor }]}></View>
            <Text style={styles.keyName}>
              Out Time
            </Text>
          </View>
          <Text style={styles.keyValue}>
            {item?.OutTime ? item.OutTime : '-'}
          </Text>
        </View>
        <View style={[styles.lineItemMain, { paddingTop: 8, paddingBottom: 8 }]}>
          <View style={styles.itemKeyMain}>
            <View style={[styles.bullet, { backgroundColor: colorTheme.lightBlue }]}></View>
            <Text style={styles.keyName}>
              Working Time
            </Text>
          </View>
          <Text style={styles.keyValue}>
            {item?.WorkingTime ? item.WorkingTime + ' Min' : '0 Min'}
          </Text>
        </View>
        <View style={[styles.lineItemMain, { paddingTop: 8, paddingBottom: 8 }]}>
          <View style={styles.itemKeyMain}>
            <View style={[styles.bullet, { backgroundColor: colorTheme.lightBlue }]}></View>
            <Text style={styles.keyName}>
              Over Time
            </Text>
          </View>
          <Text style={styles.keyValue}>
            {item?.OverTime ? item.OverTime + ' Min' : '0 Min'}
          </Text>
        </View>
        <View style={[styles.lineItemMain, { paddingTop: 8, paddingBottom: 8 }]}>
          <View style={styles.itemKeyMain}>
            <View style={[styles.bullet, { backgroundColor: colorTheme.lightBlue }]}></View>
            <Text style={styles.keyName}>
              Late Time
            </Text>
          </View>
          <Text style={styles.keyValue}>
            {item?.LateTime ? item.LateTime + ' Min' : '0 Min'}
          </Text>
        </View>
      </View>
    </View>
  );
 
  return ( 
    <ScreenLayout
      isHeaderShown={true}
      isShownHeaderLogo={false}
      headerTitle="Attendance Report"
      headerbackClick={() => {
        dispatch(clearAttendance())
        props.navigation.goBack()
      }} 
      hamburgmenuVisable={false}
      // headermenuClick = {()=>{props.navigation.dispatch(DrawerActions.openDrawer())}}
      showpowerButton={false}
      clickPowerbutton={() => { singOutBtn() }}
    >

      <View style={styles.container}>
        {/* <View style={styles.ProfileCard}>
          <Image source={Images.dummy_user_image} style={styles.profileImage} />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>
              {employeeDetails?.EmployeeName}
            </Text>
            <Text style={styles.time}>
              {fullDate}  | {currentTime}
            </Text> 
             
          </View>
        </View> */}



        {/* From datepicker */}

        <View style={styles.menuCard}>
   
          <View style={styles.searchWrapper}>
            {/* <Text style={{ color: colorTheme.blackColor }}> Search</Text> */}
            <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', width: '80%' }}>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() =>
                  setFromCalenderOpen(true)
                }
              >
                <Icon name="calendar" size={18} color={colorTheme.headerColor} />
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

                }}
                onCancel={() => {
                  setFromCalenderOpen(false);
                }}
              />

              <TouchableOpacity
                onPress={() => setToCalenderOpen(true)}
                style={styles.dateInput}>
                <Icon name="calendar" size={18} color={colorTheme.headerColor} />
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
                  // let paramData = {
                  //   EmployeeId: employeeDetails?.EmployeeId,
                  //   FromDate: fromDate,
                  //   ToDate: formatDate(selectedDate),
                  //   Token: token
                  // }
                  // fetchAttendenceData(paramData)
                }}
                onCancel={() => {
                  setToCalenderOpen(true);
                }}
              />
            </View>
            <View style={{ width: '20%' }}>
              <Pressable
                onPress={() => {
                  let paramData = {
                    EmployeeId: employeeDetails?.EmployeeId,
                    FromDate: fromDate,
                    ToDate: toDate,
                    Token: token
                  }
                  fetchAttendenceData(paramData)
                }}
                style={{ marginLeft: 12, borderWidth: 1, padding: 4, borderRadius: 4, backgroundColor: colorTheme.headerColor, justifyContent: 'center', alignItems: 'center' }}>
                <Icon
                  name={'search'}
                  size={26}
                  color={colorTheme.whiteColor}
                />
              </Pressable>
            </View>
          </View>

          {/* Attendance list */}
          {attendenceData != '' ? <SafeAreaView style={{ width: '100%' }}>
            <FlatList
              // data={DATA}
              data={attendenceData}
              renderItem={renderItem}
              // keyExtractor={(item, index) => item.id}
              keyExtractor={(item, index) => index}
              contentContainerStyle={{ paddingBottom: 140 }}
            />

          </SafeAreaView> : <Text style={{ marginTop: 80, fontSize: FontSize.f15 }}>Sorry! No Result Found</Text>}
        </View>
      </View>
      <Loader visible={loader} />

      <ConfirmationModal
        visible={logoutModal}
        title="Confirm Logout"
        msg="Are you sure you want to log out?"
        confrimBtnText="Confrim"
        onConfirm={singOutFunc}
        onCancel={() => setLogoutModal(false)}
      />


    </ScreenLayout>
  );
};

//make this component available to the app
export default AttendanceRepport;
