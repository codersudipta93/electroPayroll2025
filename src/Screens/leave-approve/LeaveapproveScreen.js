import React, { Component, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, TextInput, Image, ToastAndroid, RefreshControl, Modal, KeyboardAvoidingView, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { DashDetails } from '../Screens';
import { getDataWithOutToken, postWithToken } from '../../Service/service';
import { useTheme } from '../../Constants/Theme/Theme';
import Styles from './Style';
import { Loader, ScreenLayout } from '../../Components';
import Icon from 'react-native-vector-icons/Ionicons';
import { useState } from 'react';
import { clearApprovableListReducers, setApprovableListReducers } from '../../Store/Reducers/LeaveReducer';
import ActionSheet from 'react-native-actions-sheet';
import { FontFamily } from '../../Constants/Fonts';
import { Icons, Images } from '../../Constants/ImageIconContant';
import { useIsFocused } from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import { setleaveBalance, clearleaveBalance } from '../../Store/Reducers/LeaveReducer';
import LinearGradient from 'react-native-linear-gradient';

// create a component
const ApproveLeaveScreen = props => {
  const { colorTheme } = useTheme()
  const styles = Styles();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { employeeDetails, employeeApiUrl, token } = useSelector(state => state.common);
  const { leaveBalance } = useSelector(state => state.leave);
  // const { setApprovableListReducers, clearApprovableListReducers, } = useSelector(state => state.leave);
  const { myApprovableList } = useSelector(state => state.leave);


  const [approveBtnLoadingValue, setApproveBtnLoading] = useState(false);
  const [rejectBtnLoadingValue, setRejectBtnLoading] = useState(false);
  const [selectCurrentIndex, setSelectCurrentIndex] = useState("");
  const [selectedItemValue, setSelectedItemValue] = useState({});
  const [reasonvalue, setReasonvalue] = useState('');

  const [refreshing, setRefreshing] = React.useState(false);
  const [loader, setloader] = React.useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const actionSheetRef = useRef(null);

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const d = new Date();
  useEffect(() => {
    // MyLeaveApprovalList
    if (isFocused == true) { fetchMyapproveLists(null) }
  }, [isFocused])

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => {
      fetchMyapproveLists('pullToRefresh');
      setRefreshing(false)
    });
  }, []);

  /* == Show Toast msg function == */
  const showMsg = (msg) => {
    Snackbar.show({
      text: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

  /* == Fetch my approve leaves == */
  const fetchMyapproveLists = (event) => {
    event == null ? setloader(true) : setloader(false)
    let paramData = {
      EmployeeId: employeeDetails?.EmployeeId,
      Token: token
    }
    postWithToken(employeeApiUrl, '/MyLeaveApprovalList', paramData)
      .then((resp) => {
        console.log("MyLeaveApprovalList : ", resp);
        event == null ? setloader(false) : setloader(false)
        if (resp.Status == true) {
          // showMsg(resp.msg);
          if (resp.Data) {
            console.log("MyLeaveApprovalList : ", resp?.Data);
            dispatch(setApprovableListReducers(resp.Data))
            setTimeout(() => {
              console.log("pending approved leave list : ", myApprovableList);
            }, 2000);

          } else { dispatch(clearApprovableListReducers()) }
        } else {
          dispatch(clearApprovableListReducers())
          showMsg(resp.msg)
        }
      })
      .catch((error) => {
        console.log("Leave balance api error : ", error)
      })
  }

  // need logic ======

  /* == Approve leave request == */
  const approveLeaveRequest = (item) => {
    // console.log("approveLeaveRequest : ", item)
    let paramData = {
      EmployeeId: employeeDetails?.EmployeeId,
      Token: token,
      LeaveApprovalId: item.LeaveApprovalId,
      IsReject: false,
      RejectReason: ""
    }
    console.log("Approve params : ", paramData);
    postWithToken(employeeApiUrl, '/ApproveLeaveApplication', paramData)
      .then((resp) => {
        if (resp.Status == true) {
          console.log("response data ================")
          console.log(resp)
          console.log("================")
          // fetchMyapproveLists();

          setTimeout(() => {
            setApproveBtnLoading(false);
            dispatch(setApprovableListReducers(resp.Data))
            showMsg(resp.msg)
          }, 1000);
        } else {
          showMsg(resp.msg)
        }
      })
      .catch((error) => {
        console.log("Leave approve api error : ", error)
      })


  }

  /* == Reject btn click function ==*/
  const rejectBtnClick = (item) => {
    setSelectedItemValue(item);
    actionSheetRef.current?.show()
  }

  /* == Start rejecting leave ( Actionsheed button click ) ==*/
  const startRejecting_leave = () => {
    if (!reasonvalue) {
      showMsg("Reject Reason can not be blank.")
    } else {
      setRejectBtnLoading(true);
      // console.log("approveLeaveRequest : ", item)
      let paramData = {
        EmployeeId: employeeDetails?.EmployeeId,
        Token: token,
        LeaveApprovalId: selectedItemValue.LeaveApprovalId,
        IsReject: true,
        RejectReason: reasonvalue
      }
      console.log("Reject params : ", paramData);
      postWithToken(employeeApiUrl, '/ApproveLeaveApplication', paramData)
        .then((resp) => {
          console.log("Reject response : ", resp);
          if (resp.Status == true) {
            //fetchMyapproveLists();
            setTimeout(() => {
              dispatch(setApprovableListReducers(resp.Data))
              setRejectBtnLoading(false);
              showMsg(resp.msg)
            }, 1000);
          } else {
            showMsg(resp.msg)
          }
        })
        .catch((error) => {
          console.log("Leave balance api error : ", error)
        })

    }
  }

  const leaveInfo = (item) => {

    fetchLeaveBalance(item)
    setModalVisible(!modalVisible);
  }


  const cardItem = ({ item }) => (
    <View style={styles.listMainContainer2}>
      <View style={{ width: '15%', backgroundColor: "#051121", padding: 10, justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 8, borderBottomLeftRadius: 8, paddingVertical: 20, }}>
        <Text style={{ color: '#fff', fontSize: 12, textTransform: 'uppercase' }}>{item?.AttendanceCode}</Text>
      </View>

      <View style={{ width: '85%', padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 13, color: "#000" }}>{item?.Opening}</Text>
          <Text style={{ fontSize: 12, color: "#A8A8A8" }}>Opening</Text>
        </View>
        <View style={{ height: 30, width: 1.5, backgroundColor: '#F0F0F0' }}></View>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 13, color: "#000" }}>{item?.Credit}</Text>
          <Text style={{ fontSize: 12, color: "#A8A8A8" }}>Credit</Text>
        </View>

        <View style={{ height: 30, width: 1.5, backgroundColor: '#F0F0F0' }}></View>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 13, color: "#000" }}>{item?.Debit}</Text>
          <Text style={{ fontSize: 12, color: "#A8A8A8" }}>Debit</Text>
        </View>
        <View style={{ height: 30, width: 1.5, backgroundColor: '#F0F0F0' }}></View>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 13, color: "#000" }}>{item?.Adjustment}</Text>
          <Text style={{ fontSize: 12, color: "#A8A8A8" }}>Adjustment</Text>
        </View>
        <View style={{ height: 30, width: 1.5, backgroundColor: '#F0F0F0' }}></View>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 13, color: "#000" }}>{item?.Balance}</Text>
          <Text style={{ fontSize: 12, color: "green" }}>Balance</Text>
        </View>
      </View>

    </View>
  );

  fetchLeaveBalance = (item) => {
    //  event == null ? setloader(true):setloader(false)
    let paramData = {
      EmployeeId: item?.EmployeeId,
      //Token: token
    }
    console.log(item?.EmployeeId)
    console.log("=========================")
    postWithToken(employeeApiUrl, 'MyCurrentLeaveBalance', paramData)
      .then((resp) => {
        //  event == null ? setloader(false):setloader(false)
        if (resp.Status == true) {
          // showMsg(resp.msg);
          if (resp.Data) {
            console.log("Leave Balance data ===> ", resp?.Data);
            dispatch(setleaveBalance(resp.Data))
            //setModalVisible(!modalVisible);
          } else { dispatch(setleaveBalance([])) }
        } else {
          dispatch(setleaveBalance([]))
          showMsg(resp.msg)
        }
      })
      .catch((error) => {
        console.log("Leave balance api error : ", error)
      })
  }

  const renderItem = ({ item, index }) => (
    <LinearGradient colors={["#e6b5fd", "#fff", "#fff"]} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }}  style={styles.listMainContainer}>
      {/* <Text style={styles.listHeader}>{item?.EmployeeName}</Text> */}
      <View style={[styles.listFootersec, { marginTop: 12, marginBottom: 10, marginHorizontal: 10, }]}>
        <View style={styles.statusContainer}>
          {/* <View style={[styles.statusIcon, { backgroundColor: colorTheme.lightBlue }]}></View> */}
          <Text style={[styles.statusText, { color: colorTheme.headerColor, marginLeft: 0, fontFamily: FontFamily.bold, fontSize: 14 }]}>{item?.EmployeeName}</Text>
        </View>
        <View><Text style={[styles.applyDate, { color: colorTheme.headerColor, fontFamily: FontFamily.medium, fontSize: 13 }]}>{item?.ApplicationDate}</Text></View>
      </View>


      <View style={[styles.listFootersec,{ marginHorizontal: 10}]}>
        <View style={styles.statusContainer}>
          {/* <View style={[styles.statusIcon, { backgroundColor: colorTheme.lightBlue }]}></View> */}
          <Text style={[styles.statusText, { color: colorTheme.headerColor, marginLeft: 0, fontFamily: FontFamily.bold, fontSize: 14 }]}>{item?.LeaveType} </Text>

          <TouchableOpacity onPress={() => {
            leaveInfo(item)
          }}>
            {/* <Icon name="information-circle" size={20} color="#000" style={{ marginLeft: 12 }} /> */}
            <Text style={{ marginLeft: 8, color: 'green', fontSize: 13, textDecorationLine: 'underline' }}>Check Balance</Text>
          </TouchableOpacity>
        </View>
        {/* <View><Text style={styles.applyDate}>{item?.ApplicationDate}</Text></View> */}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 4,  marginHorizontal: 10 }}>
        <Icon name="calendar-outline" size={18} color={colorTheme.headerColor} />
        <Text style={[styles.leaveRange, { color: colorTheme.headerColor, fontFamily: FontFamily.medium, fontSize: 13 }]}>{item?.FromDate} - {item?.ToDate} ({item?.NoOfDays} {item?.NoOfDays > 1 ? 'Days' : 'Day'})</Text>
      </View>

      <Text numberOfLines={2} style={[styles.leaveReason, { paddingVertical: 12, borderRadius: 4, paddingLeft: 8, backgroundColor: '#FFEBEE', marginTop: 20, marginBottom: 10, color: colorTheme.headerColor,  marginHorizontal: 10 }]}>{item?.Reason}</Text>


      <View style={styles.border}></View>
      <View style={[styles.listFootersec, { justifyContent: 'flex-end', paddingVertical: 8 , marginBottom:12, marginRight:12}]}>
        <TouchableOpacity
          onPress={() => {
            console.log("index : ", index);
            setApproveBtnLoading(true);
            setSelectCurrentIndex(index);
            approveLeaveRequest(item)
            // setTimeout(() => {
            //   setApproveBtnLoading(false);
            // }, 3000);
          }}
          style={{ height: 40, width: 120, backgroundColor: '#299c71', borderRadius: 5, flexDirection: 'column', justifyContent: 'center' }}>
          {approveBtnLoadingValue && selectCurrentIndex == index
            ?
            <ActivityIndicator
              animating={true}
              hidesWhenStopped={true}
              color={colorTheme.whiteColor}
            ></ActivityIndicator>
            :
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

              <Icon name="checkmark-circle" size={18} color="#fff" />
              <Text style={{ textAlign: 'center', color: '#fff', marginLeft: 6 }}>Approve</Text>
            </View>
          }

        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            rejectBtnClick(item)
          }}
          style={{ height: 40, width: 120, backgroundColor: '#F44336', marginLeft: 20, borderRadius: 5, flexDirection: 'column', justifyContent: 'center' }}>
          {rejectBtnLoadingValue && selectCurrentIndex == index
            ?
            <ActivityIndicator
              animating={true}
              hidesWhenStopped={true}
              color={colorTheme.borderColor}
            ></ActivityIndicator>
            : <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

              <Icon name="close-circle" size={18} color="#fff" />
              <Text style={{ textAlign: 'center', color: '#fff', marginLeft: 6 }}>Reject</Text>
            </View>

          }

        </TouchableOpacity>

      </View>
    </LinearGradient>
  );


  return (
    <ScreenLayout
      isHeaderShown={true}
      isShownHeaderLogo={false}
      headerTitle="Approve leave"
      headerbackClick={() => { props.navigation.goBack() }}>

      <View style={[styles.container, { borderTopLeftRadius: 12, borderTopRightRadius: 12, backgroundColor: myApprovableList.length > 0 ? colorTheme.shadeLight : '#fff' }]} >
        {myApprovableList.length > 0 ?
          <FlatList
            data={myApprovableList}
            renderItem={renderItem}
            keyExtractor={(item, index) => index}
            showsVerticalScrollIndicator={false}
            style={{ marginTop: 10, borderColor: '#004792', marginBottom: 80 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          />
          :
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          >
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={Images.notFoundImage}
                style={{ width: 250, height: 250, marginTop: 22 }}
                resizeMode="contain"
              />
            </View>

          </ScrollView>
          }
      </View>

      <Loader visible={loader} />

      <ActionSheet ref={actionSheetRef} >
        <View style={{ padding: 15, paddingLeft: 30, paddingBottom: 0 }}>
          <Text style={{ fontSize: 16, letterSpacing: 0.5, fontFamily: FontFamily.bold, color: colorTheme.headerColor, marginBottom: 8 }}>Reject Leave</Text>
          <Text style={{ fontSize: 14, fontFamily: FontFamily.regular, color: '#757575', marginBottom: 16, }}>Please provide a reason for rejection</Text>
        </View>
        <View style={{ borderWidth: 0.4, marginTop: 10, marginLeft: 30, marginRight: 30, borderRadius: 5, backgroundColor: '#fff', }}>
          <TextInput
            style={{ height: 100, color: 'black', justifyContent: 'flex-start', paddingLeft: 10, fontFamily: FontFamily.medium }}
            multiline={true}
            onChangeText={text => setReasonvalue(text)}
            value={reasonvalue}
            placeholder={"Reason for rejection"}
            placeholderTextColor={'#757575'}
            textAlignVertical={'top'}
          />
        </View>

        <View style={{ marginTop: 30, marginBottom: 8 }}>
          <TouchableOpacity
            onPress={() => {
              actionSheetRef.current?.hide();
              startRejecting_leave();
            }}
            style={{ height: 48, backgroundColor: colorTheme.headerColor, marginLeft: 30, marginRight: 30, borderRadius: 5, flexDirection: 'column', justifyContent: 'center' }}
          >
            <Text style={{ textAlign: 'center', color: '#fff', fontFamily: FontFamily.medium, letterSpacing: 0.5 }}>Reject leave</Text>
          </TouchableOpacity>

        </View>

      </ActionSheet>


      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.75)', height: '100%' }}>

          <View style={[styles.content, { height: leaveBalance.length > 2 ? '45%' : '35%' }]}>
            <Icon name="close" size={28} color="#000" style={{ textAlign: 'right', marginTop: 8 }} onPress={() => {
              setModalVisible(!modalVisible)
            }} />
            <Text style={styles.modalText}>Employee Leave Balance</Text>
            <View style={{ paddingVertical: 12, marginTop: 0 }}><Text style={{ fontFamily: FontFamily.medium, color: '#000', fontSize: 15 }}>{monthNames[d.getMonth()]} , {d.getFullYear()}</Text></View>
            <View style={{ marginTop: 4, marginBottom: 40 }}>
              <FlatList
                data={leaveBalance}
                //data={[1,1,1]}
                renderItem={cardItem}
                keyExtractor={(item, index) => index}
                showsVerticalScrollIndicator={false}
                style={{ marginTop: 10, borderColor: '#004792', marginBottom: 80 }}
              />

            </View>
          </View>
        </View>

      </Modal>




    </ScreenLayout>
  );
};

//make this component available to the app
export default ApproveLeaveScreen;
