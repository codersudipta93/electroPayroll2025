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
  setAssetList,
  clearAssetList
} from '../../Store/Reducers/AssetsReducer';
import { getDataWithOutToken, getDataWithToken, postWithToken } from '../../Service/service';

import { useTheme } from '../../Constants/Theme/Theme';
import Styles from './Style';
import { Loader, NotFound, ScreenLayout } from '../../Components';
import { useIsFocused } from '@react-navigation/native';
import { Images } from '../../Constants/ImageIconContant';
import Icon from 'react-native-vector-icons/Ionicons';
import { FontFamily } from '../../Constants/Fonts';
import LinearGradient from 'react-native-linear-gradient';

// create a component
const AssetsScreen = props => {
  const { colorTheme } = useTheme()
  const styles = Styles();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [loader, setloader] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const { employeeDetails, employeeApiUrl, token } = useSelector(state => state.common);
  const { assetsList } = useSelector(state => state.assets);

  useEffect(() => {
    if (isFocused == true) {
      fetchAssetsHistory(null)
    }
  }, [isFocused])

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => {
      fetchAssetsHistory('pullToRefresh')
      setRefreshing(false)
    });
  }, []);

  fetchAssetsHistory = (event) => {
    event == null ? setloader(true) : setloader(false)
    let paramData = {
      EmployeeId: employeeDetails?.EmployeeId,
      Token: token
    }
    postWithToken(employeeApiUrl, '/MyAssets', paramData)
      .then((resp) => {
        event == null ? setloader(false) : setloader(false)
        if (resp.Status == true) {
          // showMsg(resp.msg);
          if (resp.Data) {
            console.log("Assets List ===> ", resp);
            console.log("================");
            dispatch(setAssetList(resp.Data));
          } else { dispatch(setAssetList([])) }
        } else {
          //dispatch(setAssetList([]))
          showMsg(resp.msg)
        }
      })
      .catch((error) => {
        console.log("get Assets api error : ", error)
        //dispatch(setAssetList([]))
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
    <View style={[styles.detailsCardMain, { marginTop: 6 }]}>
      <LinearGradient colors={["#df9eff","#fff",  "#fff", "#fff"]} style={styles.detailsCardWrapper}>
         <Text style={[styles.key, { marginBottom: 4,fontSize:16 }]}>DETAILS SUMMARY</Text>
          <View style={[styles.border, { marginTop: 12, marginBottom: 6, borderColor: "#8830b3", borderTopWidth: 1.5 }]}></View>
      {item?.IsReturned != "NO" ?
        <View style={[styles.headingMain,{backgroundColor:'green'}]}>
          <View style={styles.headerBullet}></View>
          <Text style={styles.headerTitle}>Returnted</Text>
        </View> :null}


        <Text style={[styles.key, { marginTop: item?.IsReturned != 'NO' ? 0 : 16 }]}>Asset Reference No</Text>
        <Text style={styles.value}>{item?.AssetReferenceNo}</Text>
   
        <Text style={styles.key}>Asset Name</Text>
        <Text style={styles.value}>{item?.AssetName ? item?.AssetName : "--"}</Text>

        <Text style={styles.key}>SerialNo</Text>
        <Text style={styles.value}>{item?.SerialNo ? item?.SerialNo : "--"}</Text>

        <Text style={styles.key}>Brand Name</Text>
        <Text style={styles.value}>{item?.Brand ? item?.Brand : "--"}</Text>

        <Text style={styles.key}>Model Name</Text>
        <Text style={styles.value}>{item?.Model ? item?.Model : "--"}</Text>

        <Text style={styles.key}>Issue Date</Text>
        <Text style={styles.value}>{item?.IssueDate ? item?.IssueDate : "--"}</Text>

        <Text style={styles.key}>Expected Return Date</Text>
        <Text style={styles.value}>{item?.ExpectedReturnDate ? item?.ExpectedReturnDate : "--"}</Text>

        <Text style={styles.key}>Issue Note</Text>
        <Text style={styles.value}>{item?.IssueNote ? item?.IssueNote : "--"}</Text>
      </LinearGradient>
    </View> 
  );

  return (
    <ScreenLayout
      isHeaderShown={true}
      isShownHeaderLogo={false}
      headerTitle="My Assets"
      headerbackClick={() => { props.navigation.goBack() }}
      showpowerButton={false}
    >
      <View
        style={[styles.container,{backgroundColor: assetsList >0 ? colorTheme.shadeLight : '#fff', borderRadius:12}]}>
        {assetsList.length > 0 ?
          <FlatList
            data={assetsList}
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
            <NotFound/>
            
          </ScrollView>
        }
      </View>
     

      <Loader visible={loader} />
    </ScreenLayout>
  );
};

//make this component available to the app
export default AssetsScreen;
