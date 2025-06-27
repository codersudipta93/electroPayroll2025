import React, { Component, useEffect, useRef, useState, useCallback } from 'react';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { View, SafeAreaView, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, ToastAndroid, Modal, Pressable, Image, RefreshControl } from 'react-native';
import { useTheme } from '../../Constants/Theme/Theme';
import Styles from './Style';
import { Loader, ScreenLayout } from '../../Components';
import Icon from 'react-native-vector-icons/Ionicons';
import { Icons, Images } from '../../Constants/ImageIconContant';

import { useDispatch, useSelector } from 'react-redux';
import { postWithToken } from '../../Service/service';
import { setearningData, setdeductionData } from '../../Store/Reducers/PayslipReducer';

import Snackbar from 'react-native-snackbar';
import ActionSheet from "react-native-actions-sheet";
import { ScrollView } from 'react-native-gesture-handler';
import { FontFamily } from '../../Constants/Fonts';
import LinearGradient from 'react-native-linear-gradient';

const PayslipScreen = props => {
  const { colorTheme } = useTheme()
  const styles = Styles();
  const scrollRef = useRef();

  const dispatch = useDispatch();
  const { employeeDetails, employeeApiUrl, token } = useSelector(state => state.common);
  const { earningData, deductionData } = useSelector(state => state.payslip);

  const isFocused = useIsFocused();

  const [loader, setloader] = React.useState(true);

  const [selectedYear, setYear] = React.useState('');
  const [years, setYears] = React.useState('');

  const [selectedMonth, setMonth] = React.useState('');
  const [selectedMonthName, setMonthName] = React.useState('');
  const [months, setMonths] = React.useState('');

  const monthActionSheet = useRef(null);
  const yearActionSheet = useRef(null);

  const [breakuptype, setbreakuptype] = React.useState('Earning');

  const [earning, setearning] = React.useState('');
  const [deduction, setdeduction] = React.useState('');
  const [netSal, setnetSal] = React.useState('');

  useEffect(() => {
    if (isFocused == true) {
      //Get Current Month and Year
      getMonthYearArr();

    }
  }, [isFocused])



 const showMsg = (msg) => {
    Snackbar.show({
      text: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }
  // Featch Payslip details
  fetchSalBreakups = () => {
    setloader(true)
    let paramData = {
      EmployeeId: employeeDetails?.EmployeeId,
      Month: selectedMonth,
      Year: selectedYear,
      Token: token
    }
    postWithToken(employeeApiUrl, 'EmployeePaySlip', paramData)
      .then((resp) => {
        console.log(resp)
        if (resp.Status == true) {
          if (resp.Data) {
            var salaryArr = resp?.Data;
            console.log("salary array ===> ", salaryArr)
            let earningAmount = "0";
            let deductionAmount = "0";
            let totalEarningAmount = "0";

            let earningArr = [];
            let deductionArr = [];

            for (let s = 0; s < salaryArr.length; s++) {
              totalEarningAmount = (parseFloat(earningAmount) + parseFloat(salaryArr[s].Value))
              if (salaryArr[s].Type == "Earning") {
                earningAmount = (parseFloat(earningAmount) + parseFloat(salaryArr[s].Value));
                earningArr.push(salaryArr[s])
              } else if (salaryArr[s].Type == "Deduction") {
                deductionAmount = (parseFloat(deductionAmount) + parseFloat(salaryArr[s].Value));
                deductionArr.push(salaryArr[s])
              }
            }
            let netSal = (parseFloat(earningAmount) - parseFloat(deductionAmount));
            //console.log("earning amount", earningAmount);
            //console.log("deduction", deductionAmount);
            //console.log("Net Sal", netSal);
            setearning(earningAmount)
            setdeduction(deductionAmount)
            setnetSal(netSal);
            if (earningArr && deductionArr) {
              dispatch(setearningData(earningArr));
              dispatch(setdeductionData(deductionArr));
              setloader(false)
            }
          } else {
            dispatch(setearningData([]))
            dispatch(setdeductionData([]))
            setloader(false)
          }
        } else {
          setloader(false)
          dispatch(setearningData([]))
          dispatch(setdeductionData([]))
          showMsg(resp.msg)
        }
      })
      .catch((error) => {
        setloader(false)
        dispatch(setearningData([]))
        dispatch(setdeductionData([]))
        console.log("payslip api error : ", error)
      })
  }

  // Earning and Deduction list render
  const salBreakupRender = ({ item, index }) => (
    <>
      <View
        style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#bdbdbd' }}
        onPress={() => setYearValueSelection(item)}
      >
        <Text style={{ fontSize: 13, marginBottom: 15, color: '#000', fontFamily: FontFamily.medium }}>{item?.Component}</Text>
        <Text style={{ fontSize: 13, marginBottom: 15, color: '#000', fontFamily: FontFamily.medium }}>₹{item?.Value}</Text>
      </View>
      {breakuptype == 'Earning' && index == (earningData.length) - 1 ?
        <View style={{ paddingHorizontal: 12, paddingVertical: 10, width: '100%', backgroundColor: '#ebf0f9', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
          <Text style={{ fontSize: 14, textTransform: 'uppercase', fontFamily: FontFamily.bold, color: '#000' }}>Total {breakuptype}s</Text>
          <Text style={{ fontSize: 15, fontFamily: FontFamily.bold, color: '#000' }}>₹ {breakuptype == 'Earning' ? earning ? earning.toFixed(2) : '0.00' : deduction ? deduction.toFixed(2) : '0.00'}</Text>
        </View>

        : null}

      {breakuptype == 'Deduction' && index == (deductionData.length) - 1 ?
        <View style={{ paddingVertical: 10, paddingHorizontal: 12, width: '100%', backgroundColor: '#ebf0f9', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
          <Text style={{ fontSize: 14, textTransform: 'uppercase', fontFamily: FontFamily.bold, color: '#000' }}>Total {breakuptype}s</Text>
          <Text style={{ fontSize: 15, fontFamily: FontFamily.bold, color: '#000' }}>₹ {breakuptype == 'Earning' ? earning ? earning.toFixed(2) : '0.00' : deduction ? deduction.toFixed(2) : '0.00'}</Text>
        </View>

        : null}

    </>

  )

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
    setTimeout(() => { fetchSalBreakups() }, 500)
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

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
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

  // Set Selected month from month input
  setMonthValueSelection = ((m) => {
    setMonth(m?.value); // Set Month number like "01" for api use Purpose
    setMonthName(m?.key) // Set Month Name like "January" for Visual Purpose
    monthActionSheet.current?.hide();
    setTimeout(() => {
      fetchSalBreakups()
    }, 1000)

  })

  // Set Selected year from year input
  setYearValueSelection = ((y) => {
    setYear(y)
    yearActionSheet.current?.hide();
    setTimeout(() => {
      fetchSalBreakups()
    }, 1000)
  })


  return (
    <ScreenLayout
      isHeaderShown={true}
      isShownHeaderLogo={false}
      headerTitle="Pay Slip"
      headerbackClick={() => { props.navigation.goBack() }}>

      <LinearGradient style={styles.container} colors={['#040120', '#6d0171', '#f405a8', '#2c0153', '#2f0020']} >
        <View style={styles.ProfileCard}>
          {/* <Image source={Images.dummy_user_image} style={styles.profileImage} />
          <Text style={styles.userName}>{employeeDetails?.EmployeeName}</Text> */}
          {/* <Text style={[styles.salary, { marginBottom: 10 }]}>Net Salary:  ₹ {netSal ? netSal.toFixed(2) : '0.00'}</Text> */}
 
          <View style={styles.menuWrapper}>
            <TouchableOpacity
              style={styles.toDateMain}
              onPress={() => monthActionSheet.current?.show()}
            >
              <Text style={{ fontSize: 13 }}>Month</Text>
              <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                <Text style={[styles.toDateLabel, { marginLeft: 12 }]}> {selectedMonthName ? selectedMonthName : 'MM'} </Text>
                <Icon name="calendar" size={18} color={colorTheme.blackColor} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toDateMain, { marginLeft: 8 }]}
              onPress={() => yearActionSheet.current?.show()}
            >
              <Text style={{ fontSize: 13 }}>Year</Text>

              <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                <Text style={[styles.toDateLabel, { marginLeft: 12 }]} >{selectedYear ? selectedYear : 'YYYY'} </Text>
                <Icon name="calendar" size={18} color={colorTheme.blackColor} />
              </View>

            </TouchableOpacity>

          </View>

          <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: 20, marginBottom: 0 }}>
            <TouchableOpacity onPress={() => {
              setbreakuptype('Earning')
              scrollRef.current?.scrollTo({
                y: 0,
                animated: true,
              });
            }} style={{ width: 120, borderRadius: 6, padding: 4, backgroundColor: breakuptype == 'Earning' ? '#198754' : '#fff', borderWidth: 1, borderColor: breakuptype == 'Deduction' ? '#1e1e1e' : '#fff', justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}><Text style={{ color: breakuptype == 'Earning' ? '#fff' : '#1e1e1e', fontSize: 13, fontFamily: FontFamily.medium }}>Earning</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setbreakuptype('Deduction');
              scrollRef.current?.scrollTo({
                y: 0,
                animated: true,
              });
            }} style={{ width: 120, borderRadius: 6, padding: 4, backgroundColor: breakuptype == 'Deduction' ? '#dc3545' : '#fff', borderWidth: 1, borderColor: breakuptype == 'Earning' ? '#1e1e1e' : '#fff', marginLeft: 10, justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}><Text style={{ color: breakuptype == 'Deduction' ? '#fff' : '#1e1e1e', fontSize: 13, fontFamily: FontFamily.medium }}>Deduction</Text></TouchableOpacity>
          </View>

        </View>

        <ScrollView style={[styles.menuCard]} ref={scrollRef} showsVerticalScrollIndicator={false}>
          {earningData != '' || deductionData != '' ?
            <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginTop: 15, marginHorizontal: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: '800', color: colorTheme.headerColor, fontFamily: FontFamily.bold }}>Descriptions</Text>
              <Text style={{ fontSize: 14, fontWeight: '800', color: colorTheme.headerColor }}>Amount(INR)</Text>
            </View> : null}

          {earningData != '' || deductionData != '' ?
            <FlatList
              data={breakuptype == 'Earning' ? earningData : deductionData}
              renderItem={salBreakupRender}
              keyExtractor={(item, index) => index}
              showsVerticalScrollIndicator={false}
              style={{ marginTop: 10, borderColor: '#004792', marginBottom: 160, }}
            /> :
            <View style={{justifyContent:'center',alignItems:'center'}}>
              <Image
                source={Images.notFoundImage}
                style={{ width: 250, height: 250, marginTop: 22 }}
                resizeMode="contain"
              />

            </View>

          }

        </ScrollView>

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

        {/* Loader */}

        <Loader visible={loader} />
        {/* <Modal
          transparent={true}
          animationType={'none'}
          visible={loader}
          
          onRequestClose={() => { }}>
          <View style={styles.modalBackground}>
            <View style={styles.activityIndicatorWrapper}>
              <ActivityIndicator animating={loader} color="black" size={30} />
            </View>
          </View>
        </Modal> */}
      </LinearGradient>
    </ScreenLayout>
  );
};

//make this component available to the app
export default PayslipScreen;
