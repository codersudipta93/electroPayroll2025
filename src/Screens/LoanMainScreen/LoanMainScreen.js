import React, { Component, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  SafeAreaView,
  Image,
  ToastAndroid,
  RefreshControl,
  ActivityIndicator,
  Modal
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {
  setloantransactionData,
  clearloantransactionData
} from '../../Store/Reducers/LoanReducer';

import { getDataWithOutToken, getDataWithToken, postWithToken } from '../../Service/service';
import { DashDetails } from '../Screens';

import { useTheme } from '../../Constants/Theme/Theme';
import Styles from './Style';
import { Loader, ScreenLayout } from '../../Components';
import { useIsFocused } from '@react-navigation/native';
import { Images } from '../../Constants/ImageIconContant';
import Icon from 'react-native-vector-icons/Ionicons';
import { FontFamily } from '../../Constants/Fonts';

//import ImagePicker from 'react-native-image-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import Snackbar from 'react-native-snackbar';

// create a component
const LoanMainScreen = props => {
  const { colorTheme } = useTheme()
  const styles = Styles();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [loader, setloader] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const { employeeDetails, employeeApiUrl, token } = useSelector(state => state.common);
  const { loantransactionList } = useSelector(state => state.loan);

  useEffect(() => {
    if (isFocused == true) {
      fetchExpenseHistory(null)
    }
  }, [isFocused])

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => {
      fetchExpenseHistory('pullToRefresh')
      setRefreshing(false)
    });
  }, []);

  fetchExpenseHistory = (event) => {
    event == null ? setloader(true) : setloader(false)
    let paramData = {
      EmployeeId: employeeDetails?.EmployeeId,
      Token: token
    }
    postWithToken(employeeApiUrl, '/MyAdvanceTransactionList', paramData)
      .then((resp) => {
        event == null ? setloader(false) : setloader(false)
        if (resp.Status == true) {
          // showMsg(resp.msg);
          if (resp.Data) {
            console.log("Expense List ===> ", resp?.Data);
            console.log("================")
            dispatch(setloantransactionData(resp.Data))
            // setModalVisible(!modalVisible);
          } else { dispatch(setExpenseList([])) }
        } else {
          dispatch(setloantransactionData([]))
          showMsg(resp.msg)
        }
      })
      .catch((error) => {
        console.log("get expense api error : ", error)
        dispatch(setloantransactionData([]))
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
    <LinearGradient colors={["#df9eff", "#fff", "#fff", "#fff"]} style={[styles.listMainContainer,{}]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, paddingLeft:6, paddingRight:12 }}>
        <Text style={[styles.listHeader, { color: colorTheme.headerColor, paddingTop: 8,fontFamily:FontFamily.bold }]}>SUMMARY</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 0 }}>
          <Icon name="calendar-outline" size={20} color={colorTheme.headerColor} />
          <Text style={[styles.leaveRange, { color: colorTheme.headerColor }]}>{item?.LoanDate}</Text>
        </View> 
      </View>  
   
      <View style={[styles.border, { marginTop: 12, marginBottom: 6, borderColor: "#8830b3", borderTopWidth: 1.5 }]}></View>


      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12,paddingHorizontal:10 }}>
        <Text style={styles.listHeader}>Your loan amount </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', marginTop: 0 }}>
          <Text style={styles.loanAmount}>₹ {item?.LoanAmount}</Text>
        </View>
      </View>


      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingHorizontal:10  }}>
        <Text style={[styles.listHeader, { textTransform: 'none' }]}>EMI per month </Text>
 
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', marginTop: 0 }}>
          <Text style={styles.loanAmount}>₹{item?.EMIAmount}</Text>
        </View> 
      </View>
      {/* <View style={[styles.border, { marginTop: 12, marginBottom: 6, borderColor: colorTheme.headerColor }]}></View> */}



      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingHorizontal:10  }}>
        <Text numberOfLines={2} style={styles.leaveReason}>Amount paid</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', marginTop: 0 }}>
          <Text style={[styles.loanAmount, { fontFamily: FontFamily.medium }]}>₹{item?.PaidAmount}</Text>
        </View>
      </View>


      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 0, paddingHorizontal:10  }}>
        <Text numberOfLines={2} style={styles.leaveReason}>No. of installment</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', marginTop: 0 }}>
          <Text style={[styles.loanAmount, { fontFamily: FontFamily.medium }]}>{item?.NoOfInstallments}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 0,paddingHorizontal:10  }}>
        <Text numberOfLines={2} style={styles.leaveReason}>Payment frequency</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', marginTop: 0 }}>
          <Text style={[styles.loanAmount, { fontFamily: FontFamily.medium }]}>{item?.Frequency}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 0,marginBottom:item?.status ? 0: 8,paddingHorizontal:10  }}>
        <Text numberOfLines={2} style={styles.leaveReason}>EMI start month</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', marginTop: 0 }}>
          <Text style={[styles.loanAmount, { fontFamily: FontFamily.medium }]}>{item?.StartMonth}, {item?.PaymentStartYear}</Text>
        </View>
      </View>

      {item?.Status ? <>

        <View style={[styles.border, { marginTop: 12, marginBottom: 6,paddingHorizontal:10  }]}></View>
        <View style={styles.listFootersec}>
          <View style={styles.statusContainer}>
            <View style={[styles.statusIcon, { backgroundColor: colorTheme.headerColor }]}></View>
            <Text style={[styles.statusText, { color: colorTheme.headerColor }]}>{item?.Status}</Text>
          </View>
        </View>

      </> : null}
    </LinearGradient>

  );

  return (
    <ScreenLayout
      isHeaderShown={true}
      isShownHeaderLogo={false}
      headerTitle="Loan"
      headerbackClick={() => { props.navigation.goBack() }}
      showpowerButton={true}
      powerbuttonIconName="add-circle"
      powerbuttonIconSize={28}
      clickPowerbutton={() => { props.navigation.navigate('ApplyLoanScreen') }}
    >
      <View
        style={[styles.container, { borderRadius: 12 }]}>
        {loantransactionList.length > 0 ?
          <FlatList
            data={loantransactionList}
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
export default LoanMainScreen;
