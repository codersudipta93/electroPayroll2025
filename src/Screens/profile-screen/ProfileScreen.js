//import liraries
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  Pressable,
  FlatList,
  ToastAndroid,
  RefreshControl,
  Modal,
  ActivityIndicator
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Styles from './Style';
import { Loader, ScreenLayout } from '../../Components';
import {
  Icons,
  Images
} from '../../Constants/ImageIconContant';

import { useDispatch, useSelector } from 'react-redux';
import { getDataWithOutToken, getDataWithToken, postWithToken } from '../../Service/service';
import {
  clearEmpAndCompanyDetails,
  setEmpBasicDetails,
  setEmployeeStatutoryDetails,
  setEmployeePersonalDetails,

} from '../../Store/Reducers/CommonReducer';

import { deleteData, getData } from '../../Service/localStorage';
import { ScrollView } from "react-native-gesture-handler";
import { ConfirmationModal } from "../../Components/confirmationModal";
import { useTheme } from '../../Constants/Theme/Theme';
import Snackbar from 'react-native-snackbar';

// create a component
const ProfileScreen = props => {
  const { colorTheme } = useTheme();
  const styles = Styles();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const {
    companyApiUrl,
    companyDetails,
    employeeApiUrl,
    employeeDetails,
    token,
    employeeBasicDetails,
    employeeStatutoryDetails,
    employeePersonalDetails
  } = useSelector(state => state.common);

  const [optionData, setoptionData] = useState("");
  const [selectedOption, setselectedOption] = useState("");

  const [refreshing, setRefreshing] = React.useState(false);
  const [loader, setloader] = React.useState(false);
   const [logoutModal, setLogoutModal] = React.useState(false);

  useEffect(() => {
    // if(isFocused == true){
    setoptionData([
      { key: 'Basic Information', selected: true, endPoint: 'EmployeeBasicInfo' },
      { key: 'Statutory Information', selected: false, endPoint: 'EmployeeStatutory' },
      { key: 'Personal Information', selected: false, endPoint: 'EmployeePersonalData' }
    ])

    fetchBasicDetails('EmployeeBasicInfo', null);
    fetchStatutoryDetails('EmployeeStatutory', null);
    fetchEmployeePersonalData('EmployeePersonalData', null);
    // }

  }, [])

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => {
      fetchBasicDetails('EmployeeBasicInfo', 'pullToRefresh');
      fetchStatutoryDetails('EmployeeStatutory', 'pullToRefresh');
      fetchEmployeePersonalData('EmployeePersonalData', 'pullToRefresh');
      setRefreshing(false)
    });
  }, []);

  const fetchBasicDetails = (endpoint, event) => {
    event == null ? setloader(true) : setloader(false)
    let paramData = {
      EmployeeId: employeeDetails?.EmployeeId,
      Token: token
    }
    postWithToken(employeeApiUrl, endpoint, paramData)
      .then((resp) => {
        if (resp.Status == true) {
          // showMsg(resp.msg);
          if (resp.Data) {
            console.log("Employee BasicInfo ===> ", resp?.Data);
            console.log("================")
            dispatch(setEmpBasicDetails(resp.Data))
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
        console.log("Employee BasicInfo api error : ", error)
      })
  }

  const fetchStatutoryDetails = (endpoint) => {
    let paramData = {
      EmployeeId: employeeDetails?.EmployeeId,
      Token: token
    }
    postWithToken(employeeApiUrl, endpoint, paramData)
      .then((resp) => {
        if (resp.Status == true) {
          // showMsg(resp.msg);
          if (resp.Data) {
            console.log("Employee Statutory Details ===> ", resp?.Data);
            console.log("================")
            dispatch(setEmployeeStatutoryDetails(resp.Data))
          } else {
            dispatch(setEmployeeStatutoryDetails([]))
            showMsg(resp.msg)
          }
        } else {
          dispatch(setEmployeeStatutoryDetails([]))
          showMsg(resp.msg);
          singOutFunc()
        }
      })
      .catch((error) => {
        dispatch(setEmployeeStatutoryDetails([]))
        console.log("Employee statutory api error : ", error)
      })
  }

  const fetchEmployeePersonalData = (endpoint) => {
    let paramData = {
      EmployeeId: employeeDetails?.EmployeeId,
      Token: token
    }
    postWithToken(employeeApiUrl, endpoint, paramData)
      .then((resp) => {
        setloader(false)
        if (resp.Status == true) {
          // showMsg(resp.msg);
          if (resp.Data) {
            console.log("Employee Personal Details ===> ", resp?.Data);
            console.log("================")
            dispatch(setEmployeePersonalDetails(resp.Data))
          } else {
            dispatch(setEmployeePersonalDetails([]))
            showMsg(resp.msg)
          }
        } else {
          dispatch(setEmployeePersonalDetails([]))
          showMsg(resp.msg);
          singOutFunc()
        }
      })
      .catch((error) => {
        event == null ? setloader(false) : setloader(false)
        dispatch(setEmployeePersonalDetails([]))
        console.log("Employee Personal details api error : ", error)
      })
  }

  /* == Show Toast msg function == */
  const showMsg = (msg) => {
    Snackbar.show({
      text: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

 

  /*== Logout functionality start === */
/*== Logout functionality start === */
  const singOutFunc = () => {
    dispatch(clearEmpAndCompanyDetails())
    deleteData();
    setTimeout(() => {
      setLogoutModal(false)
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

  const slectOption = (index) => {
    let dataArr = [];
    for (let i = 0; i < optionData.length; i++) {
      if (i == index) {
        optionData[i].selected = true;
        dataArr.push(optionData[i]);
        setselectedOption(optionData[i].endPoint)
      } else {
        optionData[i].selected = false;
        dataArr.push(optionData[i]);
      }
    }
    if (dataArr) {
      setoptionData(dataArr);
      console.log("Final data", optionData);
    }
  }

  const renderItem = ({ item, index }) => (

    <View>
      <Text style={styles.key}>{item?.PersonalDataType}</Text>
      <Text style={styles.value}>{item?.PersonalData}</Text>
    </View>
  );

  return (
    <ScreenLayout
      isHeaderShown={true}
      isShownHeaderLogo={false}
      headerTitle="My Profile"
      headerbackClick={() => { props.navigation.goBack() }}
      hamburgmenuVisable={false}
      // headermenuClick = {()=>{props.navigation.dispatch(DrawerActions.openDrawer())}}
      showpowerButton={true}
      clickPowerbutton={() => { setLogoutModal(true) }}
    >
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        onScroll={(e) => {
          //onScroll(e);
        }}
        //stickyHeaderIndices={[1]}
        //contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        style={{ width: '100%', backgroundColor: "#ebf0f9", borderRadius:12 }}>
        <View style={{ marginBottom: 8 }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#060363', width: '100%', height: 95 }}>
              <Image source={Images.profileCover} style={{ width: '100%', height: 95 }} />
            </View>
            <View style={{ height: 85, width: 85, borderRadius: 42.5, backgroundColor: '#d4d4d4', position: 'absolute', top: 50 }}>
              <Image source={Images.user_dark} style={{ width: '100%', height: 85 }} />
            </View>
          </View>
          <Text style={{ marginTop: 45, textAlign: 'center', fontSize: 15, fontWeight: 'bold' }}>{employeeBasicDetails?.EmployeeName}</Text>
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 4, marginBottom: 8 }}>
            <View style={{ height: 23, paddingHorizontal: 8, backgroundColor: colorTheme.headerColor, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
              <Text style={{ color: '#fff', fontSize: 12 }}>Emp No - {employeeBasicDetails?.EmployeeNo}</Text>
            </View>
          </View> 
        </View> 
        {/*  
        <FlatList 
          data={optionData} 
          horizontal={true}  
          renderItem={renderItem}
          keyExtractor={item => item.id} 
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 10 }}
        /> */} 

        {/* Basic Details */}
        <>{employeeBasicDetails != '' ?
          <View style={[styles.detailsCardMain, { marginTop: 6, marginBottom: employeeStatutoryDetails != '' ? 0 : 90 }]}>
            <View style={styles.detailsCardWrapper}>
              <View style={styles.headingMain}>
                <View style={styles.headerBullet}></View>
                <Text style={styles.headerTitle}>BASIC DETAILS</Text>
              </View>
              <Text style={styles.key}>Date of Birth</Text>
              <Text style={styles.value}>{employeeBasicDetails?.DOB ? employeeBasicDetails?.DOB : '--'}</Text>

              <Text style={styles.key}>Gender</Text>
              <Text style={styles.value}>{employeeBasicDetails?.Gender ? employeeBasicDetails?.Gender : '--'}</Text>

              <Text style={styles.key}>Date Of Joining</Text>
              <Text style={styles.value}>{employeeBasicDetails?.DOJ ? employeeBasicDetails?.DOJ : '--'}</Text>

              <Text style={styles.key}>Branch Name</Text>
              <Text style={styles.value}>{employeeBasicDetails?.BranchName ? employeeBasicDetails?.BranchName : '--'}</Text>

              <Text style={styles.key}>Employment Type</Text>
              <Text style={styles.value}>{employeeBasicDetails?.EmploymentType ? employeeBasicDetails?.EmploymentType : '--'}</Text>

              <Text style={styles.key}>Salary Type</Text>
              <Text style={styles.value}>{employeeBasicDetails?.SalaryType ? employeeBasicDetails?.SalaryType : '--'}</Text>

            </View>
          </View> : null}

        </>

        {/* Statutory Details */}
        <>{employeeStatutoryDetails != '' ?
          <View style={[styles.detailsCardMain, { marginTop: 6, marginBottom: employeePersonalDetails != '' ? 0 : 90 }]}>

            <View style={styles.detailsCardWrapper}>

              <View style={styles.headingMain}>
                <View style={styles.headerBullet}></View>
                <Text style={styles.headerTitle}>STATUTORY DETAILS</Text>
              </View>
              <Text style={styles.key}>Aadhaar Number</Text>
              <Text style={styles.value}>{employeeStatutoryDetails?.Aadhaar ? employeeStatutoryDetails?.Aadhaar : "--"}</Text>

              <Text style={styles.key}>Pan</Text>
              <Text style={styles.value}>{employeeStatutoryDetails?.PAN ? employeeStatutoryDetails?.PAN : "--"}</Text>

              <Text style={styles.key}>UAN</Text>
              <Text style={styles.value}>{employeeStatutoryDetails?.UAN ? employeeStatutoryDetails?.UAN : "--"}</Text>

              <Text style={styles.key}>EPF</Text>
              <Text style={styles.value}>{employeeStatutoryDetails?.EPF ? employeeStatutoryDetails?.EPF : '--'}</Text>

              <Text style={styles.key}>EPS</Text>
              <Text style={styles.value}>{employeeStatutoryDetails?.EPS ? employeeStatutoryDetails?.EPS : '--'}</Text>

              <Text style={styles.key}>ESI</Text>
              <Text style={styles.value}>{employeeStatutoryDetails?.ESI ? employeeStatutoryDetails?.ESI : '--'}</Text>

            </View>
          </View> : null}
        </>

        <>{employeePersonalDetails != '' ?
          <View style={[styles.detailsCardMain, { marginTop: 6, marginBottom: 90 }]}>
            <View style={styles.detailsCardWrapper}>
              <View style={styles.headingMain}>
                <View style={styles.headerBullet}></View>
                <Text style={styles.headerTitle}>PERSONAL DETAILS</Text>
              </View>
              <FlatList
                data={employeePersonalDetails}
                renderItem={renderItem}
                keyExtractor={(item, index) => index}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </View> : null}

          <Loader visible={loader} />

          <ConfirmationModal
            visible={logoutModal}
            title="Confirm Logout"
            msg="Are you sure you want to log out?"
            confrimBtnText="Confrim"
            onConfirm={singOutFunc}
            onCancel={() => setLogoutModal(false)}
          />
        </>
      </ScrollView>
    </ScreenLayout>
  );
};

export default ProfileScreen;

