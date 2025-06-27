import React, { Component, useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Modal, Image, ToastAndroid, RefreshControl, ActivityIndicator } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from '../../Constants/Theme/Theme';
import HolidayStyle from './Style';
import { Loader, ScreenLayout } from '../../Components';
import Icon from 'react-native-vector-icons/Ionicons';
import Snackbar from 'react-native-snackbar';
import { Icons, Images } from '../../Constants/ImageIconContant';
import { useDispatch, useSelector } from 'react-redux';
import { getDataWithToken, postWithToken } from '../../Service/service';
import {
  setleaveBalance, clearleaveBalance,
  setleaveApplicationHistory, clearleaveApplicationHistory
} from '../../Store/Reducers/LeaveReducer';

import { FontFamily, FontSize } from '../../Constants/Fonts';

// create a component
const Holiday = props => {

  const { colorTheme } = useTheme()
  const styles = HolidayStyle();
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(true);
  const { employeeDetails, employeeApiUrl, token } = useSelector(state => state.common);
  const { leaveBalance, leaveApplicationHistory } = useSelector(state => state.leave);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loader, setloader] = React.useState(false);
  const [holidayData, setholidayData] = React.useState("");

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
    postWithToken(employeeApiUrl, '/MyHolidaylist', paramData)
      .then((resp) => {
        event == null ? setloader(false) : setloader(false)
        if (resp.Status == true) {
          // showMsg(resp.msg);
          if (resp.Data) {
            console.log("Holidfay list  ===> ", resp?.Data);
            console.log("================")
            setholidayData(resp?.Data)
          } else { setholidayData([]) }
        } else {
          dispatch(setholidayData([]))
          showMsg(resp.msg)
        }
      })
      .catch((error) => {
        console.log("Holiday list api error : ", error)

      })
  }

  /* == Show Toast msg function == */
  const showMsg = (msg) => {
    Snackbar.show({
      text: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

  // const renderItem = ({ item }) => (
  //   <View style={styles.listMainContainer}>
  //     <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
  //       <Icon name="calendar-outline" size={18} color="#696969" />
  //       <Text style={styles.leaveRange}>{item?.HolidayDate}</Text>
  //     </View>
  //     <Text numberOfLines={2} style={styles.leaveReason}>{item?.HolidayName}</Text>
  //     {/* <View style={styles.border}></View> */}
  //     <View style={styles.listFootersec}>
  //       <View style={styles.statusContainer}>
  //         <Text style={[styles.statusText, {}]}>{item?.Message}</Text>
  //       </View>

  //     </View>
  //   </View>
  // );
 
  const renderItem = ({ index, item }) => (
    <View style={styles.listCard}>
      <View style={{ justifyContent: 'center', alignItems: 'center', padding: 4, backgroundColor: '#F5F7FB', borderRadius: 8 }}>
        <Image source={Images.holiday} resizeMode={"contain"} style={{
          width: 35, height: 35,opacity:1
        }} />
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'flex-start', paddingHorizontal: 14 }}>
        <Text style={{ fontFamily: FontFamily.bold, color: '#4E525E', fontSize: FontSize.f14, textAlign: 'left' }}>{item?.HolidayName}</Text>
        <Text style={{ fontFamily: FontFamily.medium, color: '#4E525E', fontSize: FontSize.f13, textAlign: 'left', marginTop: 3 }}>{item?.HolidayDate}</Text>
        { item?.Message ?<Text style={{ fontFamily: FontFamily.regular, color: '#4E525E', fontSize: FontSize.f13, textAlign: 'left', marginTop: 3 }}>{item?.Message}</Text> :null }
      </View>
    </View>
  );

  return (
    <ScreenLayout
      isHeaderShown={true}
      isShownHeaderLogo={false}
      headerTitle="Holiday List"
      headerbackClick={() => { props.navigation.goBack() }}>
      <View
        style={styles.container}>
        {holidayData.length > 0 ?
          <FlatList
            data={holidayData}
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
            <Text style={{ marginTop: 180, fontSize: 15, textAlign: 'center' }}>Sorry! No Result Found</Text>
          </ScrollView>
        } 
      </View>
      {/* <Modal
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
      </Modal> */}
      <Loader visible={loader} />
    </ScreenLayout>
  );
};

//make this component available to the app
export default Holiday;
