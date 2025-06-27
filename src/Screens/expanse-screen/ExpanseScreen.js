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
  setExpenseList,
  clearExpenseList
} from '../../Store/Reducers/ExpenseReducer';
import { getDataWithOutToken, getDataWithToken, postWithToken } from '../../Service/service';
import { DashDetails } from '../Screens';

import { useTheme } from '../../Constants/Theme/Theme';
import Styles from './Style';
import { Loader, NotFound, ScreenLayout } from '../../Components';
import { useIsFocused } from '@react-navigation/native';
import { Images } from '../../Constants/ImageIconContant';
import Icon from 'react-native-vector-icons/Ionicons';
import { FontFamily } from '../../Constants/Fonts';

//import ImagePicker from 'react-native-image-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import { windowHeight } from '../../Constants/window';
// create a component
const ExpanseScreen = props => {
  const { colorTheme } = useTheme()
  const styles = Styles();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [loader, setloader] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const { employeeDetails, employeeApiUrl, token } = useSelector(state => state.common);
  const { expenseList } = useSelector(state => state.expense);

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

  const fetchExpenseHistory = (event) => {
    event == null ? setloader(true) : setloader(false)
    let paramData = {
      EmployeeId: employeeDetails?.EmployeeId,
      Token: token
    }
    postWithToken(employeeApiUrl, '/MyExpenseList', paramData)
      .then((resp) => {
        event == null ? setloader(false) : setloader(false)
        if (resp.Status == true) {
          // showMsg(resp.msg);
          if (resp.Data) {
            console.log("Expense List ===> ", resp?.Data);
            console.log("================")
            dispatch(setExpenseList(resp.Data))
            //setModalVisible(!modalVisible);
          } else { dispatch(setExpenseList([])) }
        } else {
          dispatch(setExpenseList([]))
          showMsg(resp.msg)
        }
      })
      .catch((error) => {
        console.log("get expense api error : ", error)
        dispatch(setExpenseList([]))
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
    <LinearGradient colors={["#df9eff", "#fff"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.listMainContainer}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', marginTop: 0, marginHorizontal:4 }}>
          {/* <Icon name="calendar-outline" size={18} color="#696969" /> */}
          <Text style={styles.leaveRange}>{item?.ExpenseDate}</Text>
        </View> 
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBlock: 12,marginHorizontal:6 }}>
        <Text numberOfLines={2} style={styles.leaveReason}>{item?.Purpose}</Text>
        <Text style={styles.listHeader}>₹ {item?.Amount}</Text>

      </View>



      {item?.Remarks ?
        <View style={styles.border}></View> : null}
      {item?.Remarks ?
        <View style={styles.listFootersec}>
          <View style={styles.statusContainer}>
            <View style={[styles.statusIcon, { backgroundColor: colorTheme.headerColor }]}></View>
            <Text style={[styles.statusText, { color: colorTheme.headerColor }]}>{item?.Remarks}</Text>
          </View>
        </View> : null}
    </LinearGradient>
  );

  return (
    <ScreenLayout
      isHeaderShown={true}
      isShownHeaderLogo={false}
      headerTitle="My Expenses"
      headerbackClick={() => { props.navigation.goBack() }}
      showpowerButton={true}
      powerbuttonIconName="add-circle"
      powerbuttonIconSize={28}
      clickPowerbutton={() => { props.navigation.navigate('AddexpanseScreen') }}
    >
      <View
        style={[styles.container, { backgroundColor: expenseList.length > 0 ? colorTheme.shadeLight : '#fff', borderTopLeftRadius: 12, borderTopRightRadius: 12 }]}>
        {expenseList.length > 0 ?
          <FlatList
            data={expenseList}
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
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={Images.notFoundImage}
                style={{ width: 250, height: 250, marginTop: windowHeight / 10 }}
              //resizeMode="contain"
              />
            </View>


          </ScrollView>
        }
      </View>

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



    </ScreenLayout>
  );
};

//make this component available to the app
export default ExpanseScreen;
