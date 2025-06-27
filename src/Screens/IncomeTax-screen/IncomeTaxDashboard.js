
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
  FlatList,
  Pressable,
  Platform
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { ScreenLayout } from '../../Components';

import Styles from './IncomeTaxDashboardStyle';
import { Images } from '../../Constants/ImageIconContant';
import { useDispatch, useSelector } from 'react-redux';
import { clearEmpAndCompanyDetails } from '../../Store/Reducers/CommonReducer';
import { deleteData, getData } from '../../Service/localStorage';

import { FontFamily, FontSize } from '../../Constants/Fonts';
import { colorTheme } from '../../Constants/Theme/Theme';
import { windowHeight, windowWidth } from '../../Constants/window';

import { useIsFocused } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { ConfirmationModal } from '../../Components/confirmationModal';

// create a component
const IncomeTaxDashboard = props => {
  const styles = Styles();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const { companyApiUrl, companyDetails, employeeApiUrl, employeeDetails, token } = useSelector(state => state.common);
  const [moduleData, setModuleData] = React.useState([1, 1, 1]);
  const [logoutModal, setLogoutModal] = React.useState(false);

  useEffect(() => {
    if (isFocused == true) {
      if (props?.route?.params?.pData) {
        let subMenuArr = props?.route?.params?.pData;

        const updatedData = subMenuArr.map(item => ({
          ...item,
          color: getRandomColor()
        }));

        console.log(updatedData);
        setModuleData(updatedData)
      }
    }
  }, [isFocused])


  let colorIndex = 0; //'#e3624f',
  const getRandomColor = () => {
    const colors = [['#4fa9ff', '#1c003b']];

    // Get the color based on the current index
    const color = colors[colorIndex];
    // Update the index for the next call
    colorIndex = (colorIndex + 1) % colors.length;  // This will loop back to the first color when the end is reached

    return color;
  };


  /*== Logout Button click function === */
  const singOutBtn = () => {
    setLogoutModal(true)
  }

  /*== Logout functionality start === */
  const singOutFunc = () => {
    dispatch(clearEmpAndCompanyDetails())
    deleteData();
    setTimeout(() => {
      props.navigation.replace('CompanyLogin');
    }, 400);
  }


  const goNextScreen = (res) => {
    console.log(res)
    if (res?.Module == "ITDeclaration") {
      props.navigation.navigate('ITDeclaration', { pData: res?.Submenu })
    }else if(res.Module == "YearlyIncome"){
       props.navigation.navigate('YearlyIncome', { pData: res?.Submenu })
    }
  } 

  return (
    <ScreenLayout
      isHeaderShown={true}
      isShownHeaderLogo={false}
      headerTitle="Income Tax"
      headerbackClick={() => { props.navigation.goBack() }}
      hamburgmenuVisable={false}
      showpowerButton={true}
      clickPowerbutton={() => { singOutBtn() }}
    >
      <View style={styles.container}>

        {moduleData != "" ?
          <View style={styles.menuCard}>

            <FlatList
              data={moduleData.filter(module => module.IsActive)}
              renderItem={({ item, index }) => (
                <LinearGradient
                  colors={item?.color}
                  style={[styles.rightBox, {
                    width: "45%",
                    marginLeft: index % 2 != 0 ? 12 : 0,
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
                  </Pressable>
                </LinearGradient>
              )}
              numColumns={2}
              contentContainerStyle={{ marginBottom: 100 }}
            />

          </View> : null}
      </View>

      <ConfirmationModal
        visible={logoutModal}
        title="Confirm Logout"
        msg="Are you sure you want to log out?"
        confrimBtnText="Confrim"
        onConfirm={singOutFunc}
        onCancel={() => setLogoutModal(false)}
      />
    </ScreenLayout>
  );
};

export default IncomeTaxDashboard;

