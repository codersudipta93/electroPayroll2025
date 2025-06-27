//import liraries
import React, { Component, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  BackHandler,
  ToastAndroid,
  Modal,
  ActivityIndicator,
  FlatList,
  StatusBar,
  Linking,
  ImageBackground,
  Pressable,
  Platform
} from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

import { Loader, ScreenLayout } from '../../Components';
import { windowHeight, windowWidth } from '../../Constants/window';

import Styles from './Style';
import { useTheme } from '../../Constants/Theme/Theme';
import { Icons, Images } from '../../Constants/ImageIconContant';
import { ColorSpace } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { getDataWithOutToken, getDataWithToken, postWithToken } from '../../Service/service';
import {
  clearEmpAndCompanyDetails,
  setEmpBasicDetails,
  clearEmpBasicDetails,
} from '../../Store/Reducers/CommonReducer';
import { deleteData, getData } from '../../Service/localStorage';
import { useIsFocused } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { ConfirmationModal } from '../../Components/confirmationModal';
import HelperFunctions from '../../Constants/HelperFunctions';
import LinearGradient from 'react-native-linear-gradient';
import Snackbar from 'react-native-snackbar';
// create a component
const Dashboard = props => {
  const styles = Styles();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { colorTheme } = useTheme();
  // const { companyApiUrl,employeeApiUrl,count } = useSelector(state => state.common);
  const { companyApiUrl, companyDetails, employeeApiUrl, employeeDetails, token, employeeBasicDetails, currentAppVersion } = useSelector(state => state.common);

  const [fullDate, setDate] = useState("");
  const [currentTime, setTime] = useState("");
  const [loader, setloader] = React.useState(false);
  const [moduleData, setModuleData] = React.useState("");
  const [playstoreAppVersion, setPlaystoreAppVersion] = React.useState("");
  const [appUpdateModal, setappUpdateModal] = React.useState(false);
  const [logoutModal, setLogoutModal] = React.useState(false);
  const [exitAppModal, setexitAppModal] = React.useState(false);

  useEffect(() => {
    if (isFocused == true) {

      moduleData ? null : setloader(true)
      setInterval(() => {
        getCurrentDateTime();
      }, 1)
      fetchUserDetails('EmployeeBasicInfo');
    }

  }, [isFocused])

  /* == For hardware back button functionality == */
  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
      return () => {
        backHandler.remove();
      };
    }, [])
  );





  const handleBackButton = () => {
    // Alert.alert('Hold on!', 'Are you sure you want to go back?', [
    //   {
    //     text: 'Cancel',
    //     onPress: () => null,
    //     style: 'cancel',
    //   },
    //   { text: 'YES', onPress: () => BackHandler.exitApp() },
    // ]);
    setexitAppModal(true)
    return true;
  };

  const getAvailableModule = () => {
    let paramData = {
      EmployeeId: employeeDetails?.EmployeeId,
      Token: token
    }
    // postWithToken(employeeApiUrl, 'GetModuleList', paramData)
    postWithToken(employeeApiUrl, 'GetModuleList', paramData)
      .then((resp) => {
        console.log("Module response : ", resp)
        if (resp.Status) {

          const updatedData = resp?.Data.map(item => ({
            ...item,
            color: getRandomColor()
          }));
          console.log("result ======>", updatedData)
          setPlaystoreAppVersion(resp?.AppVersion)

          if (resp?.AppVersion != currentAppVersion) {
            setappUpdateModal(true)
          }

          setModuleData(updatedData);
          setloader(false);
        } else {
          showMsg(resp.msg);
          setloader(false);
        }
      })
      .catch((error) => {
        setloader(false);
        console.log("company error : ", error)
      })
  }


  fetchUserDetails = (endpoint) => {
    let paramData = {
      EmployeeId: employeeDetails?.EmployeeId,
      Token: token
    }
    postWithToken(employeeApiUrl, endpoint, paramData)
      .then((resp) => {
        if (resp.Status == true) {
          // showMsg(resp.msg);
          if (resp.Data) {
            console.log("Employee BasicInfo from dashboard===> ", resp?.Data);
            console.log("================")
            dispatch(setEmpBasicDetails(resp.Data));
            getAvailableModule()
          } else {
            dispatch(setEmpBasicDetails([]))
            showMsg(resp.msg)
          }
        } else {
          dispatch(setEmpBasicDetails([]))
          showMsg(resp.msg);
          singOutFunc()
        }
      })
      .catch((error) => {
        dispatch(setEmpBasicDetails([]))
        console.log("Employee BasicInfo api error from dashboard: ", error)
      })
  }

  const showMsg = (msg) => {
    Snackbar.show({
      text: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

  //===========GET CURRENT DATE AND TIME ================
  const getCurrentDateTime = (() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    let fullDate = dd + '-' + mm + '-' + yyyy;
    let currTime = ("0" + today.getHours()).slice(-2) + ":" + ("0" + today.getMinutes()).slice(-2) + ":" + ("0" + today.getSeconds()).slice(-2);
    setTime(currTime)
    setDate(fullDate)
  })

  /*== Logout Button click function === */
  const singOutBtn = () => {
    //showConfirmDialog("Logout", "Are you sure you want to logout from this app?", "Logout", "LOGOUT")

    setLogoutModal(true)
  }

  /*== Logout functionality start === */
  const singOutFunc = () => {
    dispatch(clearEmpAndCompanyDetails())
    deleteData();
    setTimeout(() => {
      setLogoutModal(true)
      props.navigation.replace('CompanyLogin');
    }, 400);
  }

  const goNextScreen = (res) => {
    console.log(res)
    if (res?.Module == "Attendance") {
      props.navigation.navigate('AttendanceDashboard', { pData: res?.Submenu })
    } else if (res?.Module == "MyProfile") {
      props.navigation.navigate('ProfileScreen', { pData: res?.Submenu })
    } else if (res?.Module == "LeaveDetails") {
      props.navigation.navigate('LeavelistScreen', { pData: res?.Submenu })
    } else if (res?.Module == "Payslip") {
      props.navigation.navigate('PayslipScreen', { pData: res?.Submenu })
    } else if (res?.Module == "MyExpenses") {
      props.navigation.navigate('ExpanseScreen', { pData: res?.Submenu })
    } else if (res?.Module == "MyAssets") {
      props.navigation.navigate('AssetsScreen', { pData: res?.Submenu })
    } else if (res?.Module == "Loan") {
      props.navigation.navigate('LoanMainScreen', { pData: res?.Submenu })
    }else if (res?.Module == "IncomeTax") {
      props.navigation.navigate('IncomeTaxDashboard', { pData: res?.Submenu })
    }
  }


  const openAppInPlayStore = async () => {
    const url = 'https://play.google.com/store/apps/details?id=io.ep.electropayroll';

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Error", "Unable to open the Play Store link.");
    }
  }

  let colorIndex = 0; //'#e3624f',["#95d065", "#017056"], ["#8a1ac3", "#440067"],
  const getRandomColor = () => {
    const colors = [['#4fa9ff', '#1c003b']];

    // Get the color based on the current index
    const color = colors[colorIndex];
    // Update the index for the next call
    colorIndex = (colorIndex + 1) % colors.length;  // This will loop back to the first color when the end is reached

    return color;
  };


  const getGreetingMessage = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return 'Good Morning,';
    } else if (currentHour < 18) {
      return 'Good Afternoon,';
    } else {
      return 'Good Evening,';
    }
  };


  return (
    <ScreenLayout
      isHeaderShown={true}
      isShownHeaderLogo={false}
      headerTitle="Dashboard"
      headerbackClick={() => { props.navigation.goBack() }}
      hamburgmenuVisable={true}
      // headermenuClick = {()=>{props.navigation.dispatch(DrawerActions.openDrawer())}}
      showpowerButton={true}
      clickPowerbutton={() => { singOutBtn() }}
    >

      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>

        {moduleData != "" ?
          <View style={styles.menuCard}>

            <View style={styles.ProfileCard}>
              <Text style={styles.wishMsg}>{getGreetingMessage()}</Text>
              <Text style={styles.userName}>{employeeDetails?.EmployeeName}</Text>
              <View style={{ marginTop: 4, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Icon
                  name={'calendar-outline'}
                  size={18}
                  color={colorTheme.headerColor}
                />
                <Text style={styles.time}>{fullDate}  | {currentTime}</Text>
              </View>
            </View>

       


            <View style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', width: '100%' }}>
              <FlatList
                data={moduleData.filter(module => module.IsActive)}
                renderItem={({ item, index }) => (
                  <LinearGradient
                    colors={item?.color}
                    style={[styles.rightBox, {
                      width: "45%",
                      // marginHorizontal: Platform.OS === 'ios' ? 0 : 10,
                      //marginRight: 5,
                      //paddingHorizontal: 8, 
                      marginLeft: index % 2 != 0 ? 12 : 0,
                      // marginHorizontal: Platform.OS === 'ios' ? 0 : 10,
                    }]}
                  >
                    <Pressable onPress={() =>
                      goNextScreen(item)
                    } style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                      <View style={{ backgroundColor: '#fff', borderRadius: 22.5, width: 45, height: 45, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={{ uri: item?.AndroidIconPath }} style={styles.cardIcon} />
                      </View>
                      <Text

                        style={styles.cardText}>{item?.ModuleName}</Text>

                      {/* </Pressable> */}
                    </Pressable>
                  </LinearGradient>

                )}
                // keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={{ marginBottom: 100 }}
              />
            </View>


          </View> : null}



      </ScrollView>



      <Loader visible={loader} />

      <ConfirmationModal
        visible={appUpdateModal}
        title="Hold on!"
        msg="A new version of ELectro Payroll is available! Please update to latest verson"
        onCancelBtnHide={true}
        confrimBtnText="Update"
        onConfirm={() => {
          openAppInPlayStore()
        }}
        onCancel={() => BackHandler.exitApp()}
      />


      <ConfirmationModal
        visible={logoutModal}
        title="Confirm Logout"
        msg="Are you sure you want to log out?"
        confrimBtnText="Confrim"
        onConfirm={singOutFunc}
        onCancel={() => setLogoutModal(false)}
      />

      <ConfirmationModal
        visible={exitAppModal}
        title="Hold on!"
        msg="Are you sure you want to go back?"
        confrimBtnText="Yes"
        onConfirm={() => {
          setexitAppModal(false)
          BackHandler.exitApp()
        }
        }
        onCancel={() => setexitAppModal(false)}
      />

      {/* <Modal
        transparent={true}
        animationType={'none'}
        visible={loader}
        style={{ }}
        onRequestClose={() => { }}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator animating={loader} color="black" size={30} />
          </View>
        </View>
      </Modal> */}
    </ScreenLayout>
  );
};

export default Dashboard;
// //props.navigation.navigate('DashDetails')
