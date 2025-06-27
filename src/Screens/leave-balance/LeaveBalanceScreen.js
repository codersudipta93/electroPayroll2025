import React, { Component, useEffect, useState, useRef } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, FlatList, ToastAndroid, Modal, Pressable, Image, RefreshControl } from 'react-native';
import { useTheme } from '../../Constants/Theme/Theme';
import Styles from './Style';
import { Loader, NotFound, ScreenLayout } from '../../Components';
import Icon from 'react-native-vector-icons/Ionicons';
import { Icons, Images } from '../../Constants/ImageIconContant';
import { useDispatch, useSelector } from 'react-redux';
import { getDataWithToken, postWithToken } from '../../Service/service';
import { setleaveBalance, clearleaveBalance } from '../../Store/Reducers/LeaveReducer';
import { FontFamily } from '../../Constants/Fonts';
import Snackbar from 'react-native-snackbar';
import ActionSheet from "react-native-actions-sheet";
import LinearGradient from 'react-native-linear-gradient';


const LeaveBalanceScreen = props => {

  const scrollRef = useRef();

  const { colorTheme } = useTheme()
  const styles = Styles();
  const dispatch = useDispatch();
  const { employeeDetails, employeeApiUrl, token } = useSelector(state => state.common);
  const { leaveBalance } = useSelector(state => state.leave);
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loader, setloader] = React.useState(false);


  const [selectedYear, setYear] = React.useState('');
  const [years, setYears] = React.useState('');

  const [selectedMonth, setMonth] = React.useState('');
  const [selectedMonthName, setMonthName] = React.useState('');
  const [months, setMonths] = React.useState('');

  const monthActionSheet = useRef(null);
  const yearActionSheet = useRef(null);


  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const d = new Date();

  useEffect(() => {
    if (isFocused == true) {

      getMonthYearArr();
    }

  }, [isFocused])

  getMonthYearArr = (() => {
    let monthArr = [
      { key: 'January', value: '01' },
      { key: 'February', value: '02' },
      { key: 'March', value: '03' },
      { key: 'April', value: '04' },
      { key: 'May', value: '05' },
      { key: 'June', value: '06' },
      { key: 'July', value: '07' },
      { key: 'August', value: '08' },
      { key: 'September', value: '09' },
      { key: 'October', value: '10' },
      { key: 'November', value: '11' },
      { key: 'December', value: '12' },
    ]
    let today = new Date();
    setYear(today.getFullYear());
    setTimeout(() => { fetchLeaveBalance(null) }, 500)
    let priviousYear = today.getFullYear() - 1;
    let yearArr = [];
    yearArr.push(priviousYear)
    let curMonth = today.getMonth() + 1;
    setMonths(monthArr);
    console.log(priviousYear)
    for (let i = 0; i < 4; i++) {
      yearArr.push(yearArr[i] + 1)
    }

    //Set years arr
    setYears(yearArr);

    for (let j = 0; j < monthArr.length; j++) {
      if (monthArr[j].value == curMonth) {
        setMonth(monthArr[j].value);
        setMonthName(monthArr[j].key);
      }
    };

  })


  // Set Selected month from month input
  setMonthValueSelection = ((m) => {
    setMonth(m?.value); // Set Month number like "01" for api use Purpose
    setMonthName(m?.key) // Set Month Name like "January" for Visual Purpose
    monthActionSheet.current?.hide();
    setTimeout(() => {
      fetchLeaveBalance(null)
    }, 1000)

  })

  // Set Selected year from year input
  setYearValueSelection = ((y) => {
    setYear(y)
    yearActionSheet.current?.hide();
    setTimeout(() => {
      fetchLeaveBalance(null)
    }, 1000)
  })




  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => {
      fetchLeaveBalance('pullToRefresh')
      setRefreshing(false)
    });
  }, []);

  fetchLeaveBalance = (event) => {
    event == null ? setloader(true) : setloader(false)
    let paramData = {
      EmployeeId: employeeDetails?.EmployeeId,
      Token: token,
      Year: selectedYear,
      Month: selectedMonth
    }


    console.log(selectedMonth)
    console.log(selectedMonthName)

    console.log(selectedYear)


    // postWithToken(employeeApiUrl, 'MyCurrentLeaveBalance', paramData) // As date on 09-05-2025
    postWithToken(employeeApiUrl, 'MyLeaveBalanceByMonthYear', paramData)

      .then((resp) => {
        event == null ? setloader(false) : setloader(false)
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

  /* == Show Toast msg function == */
 const showMsg = (msg) => {
    Snackbar.show({
      text: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

  const renderMonthItem = ({ item }) => (
    <TouchableOpacity
      style={{ marginTop: 12, borderBottomColor: '#ebf0f9', borderBottomWidth: 1 }}
      onPress={() => setMonthValueSelection(item)}
    >
      <Text style={{ fontSize: 14, marginBottom: 12, fontWeight: selectedMonthName == item.key ? '800' : '400' }}>{item?.key} ({item?.value})</Text>
    </TouchableOpacity>
  );

  const renderYearItem = ({ item }) => (
    <TouchableOpacity
      style={{ marginTop: 12, borderBottomColor: '#ebf0f9', borderBottomWidth: 1 }}
      onPress={() => setYearValueSelection(item)}
    >
      <Text style={{ fontSize: 14, marginBottom: 12, fontWeight: selectedYear == item ? '800' : '400' }}>{item}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <View style={[styles.listMainContainer, { flexDirection: 'column' }]}>
      <LinearGradient colors={["#df9eff", "#fff"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ width: '99.99%',   marginBottom: 12, borderTopRightRadius: 6, borderTopLeftRadius: 6 }}>
        <View style={{paddingVertical:6, paddingLeft:6}}> 
                  <Text style={{ color: colorTheme.headerColor, fontSize: 16, textTransform: 'uppercase', fontFamily: FontFamily.bold, textAlign: 'left' }}>{item?.AttendanceCode}</Text>
        </View>
      </LinearGradient> 
 
      <View style={{ width: '100%', padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 13, color: colorTheme.headerColor, fontFamily: FontFamily.bold, marginBottom: 4 }}>{item?.Opening}</Text>
          <Text style={{ fontSize: 13, color: "#A8A8A8", fontFamily: FontFamily.medium }}>Opening</Text>
        </View>
        <View style={{ height: 30, width: 1.5, backgroundColor: '#F0F0F0' }}></View>

        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 13, color: colorTheme.headerColor, fontFamily: FontFamily.bold, marginBottom: 4 }}>{item?.Credit}</Text>
          <Text style={{ fontSize: 13, color: "#A8A8A8", fontFamily: FontFamily.medium }}>Credit</Text>
        </View>

        <View style={{ height: 30, width: 1.5, backgroundColor: '#F0F0F0' }}></View>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 13, color: colorTheme.headerColor, fontFamily: FontFamily.bold, marginBottom: 4 }}>{item?.Debit}</Text>
          <Text style={{ fontSize: 13, color: "#A8A8A8", fontFamily: FontFamily.medium }}>Debit</Text>
        </View>
        <View style={{ height: 30, width: 1.5, backgroundColor: '#F0F0F0' }}></View>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 13, color: colorTheme.headerColor, fontFamily: FontFamily.bold, marginBottom: 4 }}>{item?.Adjustment}</Text>
          <Text style={{ fontSize: 13, color: "#A8A8A8", fontFamily: FontFamily.medium }}>Adjustment</Text>
        </View>
        <View style={{ height: 30, width: 1.5, backgroundColor: '#F0F0F0' }}></View>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 13, color: colorTheme.headerColor, fontFamily: FontFamily.bold, marginBottom: 4 }}>{item?.Balance}</Text>
          <Text style={{ fontSize: 13, color: "green", fontFamily: FontFamily.medium }}>Balance</Text>
        </View>
      </View>

    </View>
  );

  return (
    <ScreenLayout
      isHeaderShown={true}
      isShownHeaderLogo={false}
      headerTitle="Leave Balance"
      headerbackClick={() => { props.navigation.goBack() }}>

      <View style={styles.centeredView}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Image source={Images.loader} resizeMode={"contain"} style={{
                width: 60, height: 60, borderRadius: 75 / 2,
                borderWidth: 3, overflow: 'hidden', overlayColor: 'white',
              }} />
            </View>
          </View>
        </Modal>

      </View>

      <LinearGradient colors={['#040120', '#6d0171', '#f405a8', '#2c0153', '#2f0020']} style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 12 }}>

        <View style={[styles.menuWrapper, {}]}>
          <TouchableOpacity
            style={styles.toDateMain}
            onPress={() => monthActionSheet.current?.show()}
          >
            <Text style={{ fontSize: 13, fontFamily: FontFamily.medium, color: colorTheme.headerColor }}>Month</Text>
            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
              <Text style={[styles.toDateLabel, { marginLeft: 12, fontFamily: FontFamily.bold, color: colorTheme.headerColor, marginRight: 4 }]}> {selectedMonthName ? selectedMonthName : 'MM'} </Text>
              <Icon name="calendar" size={18} color={colorTheme.headerColor} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toDateMain, { marginLeft: 8 }]}
            onPress={() => yearActionSheet.current?.show()}
          >
            <Text style={{ fontSize: 13, fontFamily: FontFamily.medium, color: colorTheme.headerColor }}>Year</Text>

            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
              <Text style={[styles.toDateLabel, { marginLeft: 12, fontFamily: FontFamily.bold, color: colorTheme.headerColor, marginRight: 4 }]}>{selectedYear ? selectedYear : 'YYYY'} </Text>
              <Icon name="calendar" size={18} color={colorTheme.headerColor} />
            </View>

          </TouchableOpacity>

        </View>
      </LinearGradient>


      <View style={[styles.container, { backgroundColor: leaveBalance.length > 0 ? colorTheme.shadeLight : '#fff' }]}>
        {/* <View style={{ paddingVertical: 12 }}><Text style={{ fontFamily: FontFamily.bold, color: colorTheme.headerColor, fontSize: 16 }}>{selectedMonthName}, {selectedYear}</Text></View> */}

        {leaveBalance.length > 0 ?
          <FlatList
            data={leaveBalance}
            renderItem={renderItem}
            keyExtractor={(item, index) => index}
            showsVerticalScrollIndicator={false}
            style={{ marginTop: 15, borderColor: '#004792', marginBottom: 80 }}
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
            <Image
              source={Images.notFoundImage}
              style={{ width: 250, height: 250, marginTop: 22 }}
              resizeMode="contain"
            />
          </ScrollView>
        }
      </View>


      {/* Action sheet for Month selection */}
      <ActionSheet ref={monthActionSheet} containerStyle={styles.actionsheetStyle}>
        <View style={{ paddingHorizontal: 12 }}>
          <Text style={styles.modalText}>Select Month</Text>
          <FlatList
            data={months}
            renderItem={renderMonthItem}
            keyExtractor={(item, index) => index}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ActionSheet>

      {/* Action sheet for Year selection */}
      <ActionSheet ref={yearActionSheet} containerStyle={styles.actionsheetStyle}>
        <View style={{ paddingHorizontal: 12 }}>
          <Text style={styles.modalText}>Select Year</Text>
          <FlatList
            data={years}
            renderItem={renderYearItem}
            keyExtractor={(item, index) => index}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ActionSheet>



      <Loader visible={loader} />
    </ScreenLayout>
  );
};

//make this component available to the app
export default LeaveBalanceScreen;
