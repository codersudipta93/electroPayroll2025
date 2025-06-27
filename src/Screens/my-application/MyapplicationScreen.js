import React, { Component, useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Modal, Image, ToastAndroid, RefreshControl, ActivityIndicator } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from '../../Constants/Theme/Theme';
import Styles from './Style';
import { Loader, ScreenLayout } from '../../Components';
import Icon from 'react-native-vector-icons/Ionicons';

import { Icons, Images } from '../../Constants/ImageIconContant';
import { useDispatch, useSelector } from 'react-redux';
import { getDataWithToken, postWithToken } from '../../Service/service';
import {
  setleaveBalance, clearleaveBalance,
  setleaveApplicationHistory, clearleaveApplicationHistory
} from '../../Store/Reducers/LeaveReducer';
import { FontFamily } from "../../Constants/Fonts";
import LinearGradient from "react-native-linear-gradient";
import Snackbar from 'react-native-snackbar';

// create a component
const ApplyApplicationScreen = props => {

  const { colorTheme } = useTheme()
  const styles = Styles();
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(true);
  const { employeeDetails, employeeApiUrl, token } = useSelector(state => state.common);
  const { leaveBalance, leaveApplicationHistory } = useSelector(state => state.leave);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loader, setloader] = React.useState(false);

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused == true) {
      fetchLeaveApplicationHistory(null)
    }

  }, [isFocused])

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => {
      fetchLeaveApplicationHistory('pullToRefresh')
      setRefreshing(false)
    });
  }, []);

  fetchLeaveApplicationHistory = (event) => {
    event == null ? setloader(true) : setloader(false)
    let paramData = {
      EmployeeId: employeeDetails?.EmployeeId,
      Token: token
    }
    postWithToken(employeeApiUrl, '/MyLeaveApplications', paramData)
      .then((resp) => {
        event == null ? setloader(false) : setloader(false)
        if (resp.Status == true) {
          // showMsg(resp.msg);
          if (resp.Data) {
            console.log("Leave Application history ===> ", resp?.Data);
            console.log("================")
            dispatch(setleaveApplicationHistory(resp.Data))
            //setModalVisible(!modalVisible);
          } else { dispatch(setleaveApplicationHistory([])) }
        } else {
          dispatch(setleaveApplicationHistory([]))
          showMsg(resp.msg)
        }
      })
      .catch((error) => {
        console.log("Leave balance api error : ", error)

      })
  }
 
  /* == Show Toast msg function == */
 const showMsg = (msg) => {
    Snackbar.show({
      text: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }   

  const renderItem = ({ item }) => (
    <LinearGradient colors={["#df9eff", '#fff', '#fff', '#fff', "#df9eff"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={styles.listMainContainer}>  
      <Text style={[styles.listHeader, { color: colorTheme.headerColor, fontFamily: FontFamily.bold }]}>{item?.LeaveType}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 12, marginHorizontal:12 }}>
        <Icon name="calendar-outline" size={18} color={colorTheme.headerColor} />
        <Text style={[styles.leaveRange, { color: colorTheme.headerColor }]}>{item?.FromDate} - {item?.ToDate}  ({item?.NoOfDays} {item?.NoOfDays > 1 ? 'Days' : 'Day'})</Text>
      </View> 
      <Text numberOfLines={2} style={[styles.leaveReason,{marginHorizontal:12}]}>{item?.Reason}</Text>
      <View style={styles.border}></View>
      <View style={styles.listFootersec}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusIcon, { backgroundColor: colorTheme.headerColor }]}></View>
          <Text style={[styles.statusText, { color: colorTheme.headerColor }]}>{item?.ApplicationStatus}</Text>
        </View>
        <View><Text style={styles.applyDate}>{item?.ApplicationDate}</Text></View>
      </View>
    </LinearGradient>
  ); 

  return (
    <ScreenLayout
      isHeaderShown={true}
      isShownHeaderLogo={false}
      headerTitle="My Applications"
      headerbackClick={() => { props.navigation.goBack() }}>
      <View
        style={[styles.container, { borderTopLeftRadius: 12, borderTopRightRadius: 12, backgroundColor: leaveApplicationHistory.length > 0 ? colorTheme.shadeLight : '#fff' }]}>
        {leaveApplicationHistory.length > 0 ?
          <FlatList
            data={leaveApplicationHistory}
            renderItem={renderItem}
            keyExtractor={(item, index) => index}
            showsVerticalScrollIndicator={false}
            style={{ marginTop: 10, borderColor: '#004792', marginBottom: 0 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          /> :
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          >
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
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

    </ScreenLayout>
  );
};

//make this component available to the app
export default ApplyApplicationScreen;
