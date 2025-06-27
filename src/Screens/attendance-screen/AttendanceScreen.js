import React, { Component, useState, useEffect } from 'react';
import {
  View, Text, Image, Platform,
  StyleSheet, TouchableOpacity, FlatList,
  SafeAreaView, ToastAndroid, ActivityIndicator, Modal, Alert, PermissionsAndroid, Linking, Pressable
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';

//Appearance
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../Constants/Theme/Theme';
import { Loader, NotFound, ScreenLayout } from '../../Components';
import { Icons, Images } from '../../Constants/ImageIconContant';
import { FontFamily, FontSize } from '../../Constants/Fonts';

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
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Styles from './Style';
import { seAttendance, clearAttendance, setTodaysAttendanceReport } from '../../Store/Reducers/AttendanceReducer';
import LinearGradient from 'react-native-linear-gradient';

// create a component
const AttendanceScreen = props => {
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
  const [mobileAttendanceStatus, setMobileAttendanceStatus] = useState(true);

  // Redux 
  const dispatch = useDispatch();
  const { employeeDetails, employeeApiUrl, token } = useSelector(state => state.common);
  const { attendenceData, todayAttandanceReport } = useSelector(state => state.attendence);
  const isFocused = useIsFocused();

  const [loader, setloader] = React.useState(true);
  // const locationServicesAvailable = await ConnectivityManager.areLocationServicesEnabled()

  // Check Location permission
  // const locationPermission = await ConnectivityManager.isLocationPermissionGranted()

  useEffect(() => {
    if (isFocused == true) {
      // props.navigation.navigate('AttendanceRepport')
      setInterval(() => {
        getCurrentDateTime();
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
    console.log("Attendance param", paramData)
    postWithToken(employeeApiUrl, '/EmployeeDailyPunchData', paramData)
      .then((resp) => {
        setloader(false)
        console.log("resp data : ", resp);
        if (resp.Status == true) {
          if (resp.Data) {
            dispatch(setTodaysAttendanceReport(resp.Data))
          } else { dispatch(setTodaysAttendanceReport([])) }
        } else {
          dispatch(setTodaysAttendanceReport([]))
          showMsg(resp.msg);
          setloader(false)
        }
      })
      .catch((error) => {
        setloader(false)
        console.log("Attendance api error : ")
      })
  }


  const eligibleForAttendance = () => {
    let paramData = {
      "EmployeeId": employeeDetails?.EmployeeId,
      Token: token,
    }
    postWithToken(employeeApiUrl, '/MobileAttendanceControlValidation', paramData)
      .then((resp) => {
        // setloader(false)
        console.log("Attendance status data :========== ", resp);
        if (resp.Status == true) {
          if (resp.Data) {
            setMobileAttendanceStatus(resp?.Data?.IsMobileAttendance)
          } else {
            setMobileAttendanceStatus(false)
          }
        } else {
          showMsg(resp.msg);
          setMobileAttendanceStatus(false)
          // setloader(false)
        }
      })
      .catch((error) => {
        // setloader(false)
        console.log("attendance in out api error : ", error)
      })
  }


  fetchTodayAttendance = (paramData) => {
    console.log("Attendance param", paramData)
    postWithToken(employeeApiUrl, '/MobileAttendanceSummary', paramData)
      .then((resp) => {
        // btnSetLoading(false);
        //console.log("todays Attendance status ===> ", resp);
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

      if (Platform.OS == 'android') {
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
      } else {
        const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        return result === RESULTS.GRANTED;
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
      "EmployeeId": employeeDetails?.EmployeeId,
      "Token": token,
      "PunchDate": calenderDate
    }

    eligibleForAttendance();
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
    <View style={[styles.listContainer]}>
      <LinearGradient colors={item?.IOType == 'IN' ? ['#80db7b', '#ecffeb'] : ['#ffc8c4', '#faeceb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.listWrapper, { paddingVertical: 12, borderWidth: 1, borderColor: item?.IOType == 'IN' ? "#074a00" : '#FC6860', }]}>

        <View style={[styles.lineItemMain, { paddingBottom: 2 }]}>
          <View style={[styles.itemKeyMain]}>
            {/* <View style={[styles.bullet, { backgroundColor: colorTheme.sucessColor }]}></View> */}
            <Text style={[styles.keyName, { fontSize: 16, fontFamily: FontFamily.bold, color: item?.IOType == 'IN' ? "#074a00" : '#FC6860' }]}>
              {item?.PunchTime ? item.PunchTime : '-:-'}
            </Text>
          </View>
          <Text style={[styles.keyValue, { fontSize: 16, fontFamily: FontFamily.medium, color: item?.IOType == 'IN' ? "#074a00" : '#FC6860' }]}>
            {item?.IOType ? item.IOType : ''}
          </Text>
        </View>

        {/* <View style={styles.lineItemMain}>
          <View style={styles.itemKeyMain}>
           
            <Text style={[styles.keyName, { color: '#8A8E9C',  }]}>
              Punch Time
            </Text>
          </View>
          <Text style={[styles.keyValue, { color: '#8A8E9C' }]}>
           IO Type
          </Text>
        </View> */}
      </LinearGradient>
    </View>

    // <View style={styles.listContainer}>
    //   <View style={styles.listWrapper}>

    //     <View style={styles.lineItemMain}>
    //       <View style={styles.itemKeyMain}>
    //         <View style={[styles.bullet, { backgroundColor: colorTheme.sucessColor }]}></View>
    //         <Text style={styles.keyName}>
    //           Punch Time
    //         </Text>
    //       </View>
    //       <Text style={styles.keyValue}>
    //         {item?.PunchTime ? item.PunchTime : '-:-'}
    //       </Text>
    //     </View>

    //     <View style={styles.lineItemMain}>
    //       <View style={styles.itemKeyMain}>
    //         <View style={[styles.bullet, { backgroundColor: colorTheme.lightBlue }]}></View>
    //         <Text style={styles.keyName}>
    //           IO Type
    //         </Text>
    //       </View>
    //       <Text style={styles.keyValue}>
    //         {item?.IOType ? item.IOType : ''}
    //       </Text>
    //     </View>

    //   </View>
    // </View>
  );

  return (
    <ScreenLayout
      isHeaderShown={true}
      isShownHeaderLogo={false}
      headerTitle="My Punches"
      headerbackClick={() => {
        dispatch(clearAttendance())
        props.navigation.goBack()
      }}
      hamburgmenuVisable={false}
      // headermenuClick = {()=>{props.navigation.dispatch(DrawerActions.openDrawer())}}
      showpowerButton={false}
      clickPowerbutton={() => { singOutBtn() }}
    >
      {/* <View style={styles.container}> */}
      <LinearGradient
        //colors={['#4fa9ff', '#1c003b','#1c003b' ]}
        colors={['#040120', '#6d0171', '#f405a8', '#2c0153', '#2f0020']}
        style={styles.container}
      >
        <View style={styles.ProfileCard}>
          <Image source={Images.dummy_user_image} style={styles.profileImage} />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>
              {employeeDetails?.EmployeeName}
            </Text>
            <Text style={styles.time}>
              {fullDate}  | {currentTime}
            </Text>

          </View>
        </View>

        {/* Attendance time in time out */}

        {/* <View style={styles.attendenceMain}>
          <View style={styles.timeoutTimeinMain}>
            <Text style={styles.AttendenceLabel}>
              Time in -
            </Text>
            <Text style={styles.AttendenceTime}>
              {inTime}
            </Text>
          </View>

          <View style={styles.timeoutTimeinMain}>
            <Text style={styles.AttendenceLabel}>
              Time Out -
            </Text>
            <Text style={styles.AttendenceTime}>
              {outTime}
            </Text>
          </View>
        </View> */}
        {mobileAttendanceStatus == true ?
          <View style={styles.attendenceMain}>

            <TouchableOpacity
              disabled={btnClockoutLoadingValue}
              style={[styles.attendenceBtn, { opacity: btnClockoutLoadingValue == true ? 0.5 : 1, backgroundColor: colorTheme.whiteColor }]}
              // onPress={() => {
              //   submitAttendence('IN')
              // }} 
              onPress={() => {
                !btnLoadingValue ? submitAttendence('IN') : null
              }
              }
            >

              {btnLoadingValue ?
                <ActivityIndicator
                  animating={true}
                  hidesWhenStopped={true}
                  color={colorTheme.headerColor}
                ></ActivityIndicator>
                :
                <Text style={[styles.AttendenceLabel, { color: colorTheme.headerColor, fontSize: 12 }]}>
                  CLOCK IN
                </Text>
              }

            </TouchableOpacity>


            <TouchableOpacity
              disabled={btnLoadingValue}
              style={[styles.attendenceBtn, { marginLeft: 12, backgroundColor: '#e68a00', opacity: btnLoadingValue == true ? 0.5 : 1 }]}
              // onPress={() => {
              //   submitAttendence('OUT')
              // }}
              onPress={() => {
                // !btnLoadingValue ? submitAttendence('OUT') : null
                !btnClockoutLoadingValue ? submitAttendence('OUT') : null
              }

              }
            >
              {/* <Text style={styles.AttendenceLabel}>
                Clock Out
              </Text> */}
              {/* {btnLoadingValue ? */}
              {btnClockoutLoadingValue ?
                <ActivityIndicator
                  animating={true}
                  hidesWhenStopped={true}
                  color={colorTheme.whiteColor}
                ></ActivityIndicator>
                :
                <Text style={styles.AttendenceLabel}>
                  CLOCK OUT
                </Text>
              }
            </TouchableOpacity>
          </View> : null}

        {/* From datepicker */}

        <View style={styles.menuCard}>

          <View style={styles.menuWrapper}>
            <Text style={{ color: colorTheme.headerColor }}> Search by date</Text>
            <TouchableOpacity
              style={styles.toDateMain}
              onPress={() =>
                setFromCalenderOpen(true)
              }
            >
              <Icon name="calendar" size={18} color={colorTheme.headerColor} />
              <Text style={styles.toDateLabel}>{fromDate}</Text>
            </TouchableOpacity>

            <View style={{ width: '20%' }}>
              <Pressable
                onPress={() => {
                  setloader(true)

                  let paramData = {
                    "EmployeeId": employeeDetails?.EmployeeId,
                    Token: token,
                    "PunchDate": fromDate
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


          </View>

          {/* Attendance list */}
          {todayAttandanceReport != '' ? <SafeAreaView style={{ width: '100%' }}>
            <FlatList
              // data={DATA}
              data={todayAttandanceReport}
              renderItem={renderItem}
              // keyExtractor={(item, index) => item.id}
              keyExtractor={(item, index) => index}
              contentContainerStyle={{ paddingBottom: 140 }}
            />

          </SafeAreaView> : <Image
            source={Images.notFoundImage}
            style={{ width: 250, height: 250, marginTop: 22 }}
            resizeMode="contain"
          />
          }


        </View>
      </LinearGradient>

      <Loader visible={loader} />
    </ScreenLayout>
  );
};

//make this component available to the app
export default AttendanceScreen;
