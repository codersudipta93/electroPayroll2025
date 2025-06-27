import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StatusBar, Platform, ImageBackground, Pressable } from 'react-native';
import { useTheme } from '../Constants/Theme/Theme';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Safe Area Hook
import { useSelector } from 'react-redux';
import { FontFamily, FontSize } from '../Constants/Fonts';
import { postWithToken } from '../Service/service';
import { ScreenLayout } from '../Components';

import { Images } from '../Constants/ImageIconContant';
import Icon from 'react-native-vector-icons/Ionicons';
import { ScrollView } from 'react-native-gesture-handler';

const Sidebar = (props) => {
  const navigation = useNavigation();
  const { colorTheme } = useTheme();
  const [activeItem, setActiveitem] = React.useState('Dashboard');
  const { employeeDetails, token, employeeApiUrl } = useSelector(state => state.common);
  const [moduleData, setModuleData] = React.useState("");
  
  // Use Safe Area Insets for top padding
  const insets = useSafeAreaInsets();
  const paddingTop = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : insets.top;

  useEffect(() => {
    setActiveitem('Attendance');
    getAvailableModule()
  }, [activeItem]);

  const clickIndividual_DrawerMenu = (screenName) => {
    setActiveitem(screenName);
    props.navigation.closeDrawer();
  };

  const goNextScreen = (res) => {
    if (res?.Module === "Attendance") {
      navigation.navigate('AttendanceDashboard', { pData: res?.Submenu });
    } else if (res?.Module === "MyProfile") {
      navigation.navigate('ProfileScreen', { pData: res?.Submenu });
    } else if (res?.Module === "LeaveDetails") {
      navigation.navigate('LeavelistScreen', { pData: res?.Submenu });
    } else if (res?.Module === "Payslip") {
      navigation.navigate('PayslipScreen', { pData: res?.Submenu });
    } else if (res?.Module === "MyExpenses") {
      navigation.navigate('ExpanseScreen', { pData: res?.Submenu });
    } else if (res?.Module === "MyAssets") {
      navigation.navigate('AssetsScreen', { pData: res?.Submenu });
    } else if (res?.Module === "Loan") {
      navigation.navigate('LoanMainScreen', { pData: res?.Submenu });
    }else if (res?.Module === "IncomeTax") {
      navigation.navigate('IncomeTaxDashboard', { pData: res?.Submenu });
    }
  };

  const getAvailableModule = () => {
    let paramData = {
      EmployeeId: employeeDetails?.EmployeeId,
      Token: token
    };
    postWithToken(employeeApiUrl, 'GetModuleList', paramData)
      .then((resp) => {
        if (resp.Status) {
          setModuleData(resp?.Data);
        } else {
          showMsg(resp.msg);
        }
      })
      .catch((error) => {
        console.log("company error : ", error);
      });
  };

  return (

      <ImageBackground
        source={Images.auth_bg}
        //style={styles.backgroundImageView}
        style={{ flex: 1, width: '100%', flexDirection: 'column', backgroundColor: colorTheme.shadeDark, paddingTop }}
      >
    
    {/* <View style={{ flex: 1, width: '100%', flexDirection: 'column', backgroundColor: colorTheme.shadeDark, paddingTop }}> */}
      <View style={{ height: 120, flexDirection: 'column', justifyContent: 'center' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center',marginTop:40 }}>
            <Image source={Images.dummy_user_image} style={{height:65,width:65}} />
           <Text style={{ fontSize: 16, textAlign: 'center', fontFamily: FontFamily.medium, letterSpacing: 0.5, color: colorTheme.whiteColor, marginTop:12 }}>
              {employeeDetails?.EmployeeName}
            </Text>
            <View style={{ marginTop: 8, backgroundColor: "#0051e5", padding: 2, paddingVertical:5, paddingHorizontal: 8, justifyContent: 'center', alignItems: 'center', borderRadius: 8 }}>
              <Text style={{ color: colorTheme.buttonTextColor, fontSize: FontSize.f12, fontFamily: FontFamily.medium }}>
                #Emp No - {employeeDetails?.EmployeeNo}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={{marginTop:65}}>
        {moduleData !== "" ? (
          <FlatList
            data={moduleData.filter(module => module.IsActive)}
            showsVerticalScrollIndicator={true}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  setActiveitem(item?.Module);
                  clickIndividual_DrawerMenu('Dashboard');
                  goNextScreen(item);
                }}
                style={{
                  backgroundColor: item.Module === activeItem ? colorTheme.textUnderlineColor : null,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  paddingVertical: 15,
                  paddingLeft: 10,
                  marginHorizontal: 12,
                  borderRadius: 6
                }}
              >
                <Image source={{ uri: item?.AndroidIconPath }} style={{ height: 30, width: 30 }} />
                <Text style={{
                  color: item.Module === activeItem ? colorTheme.lightBlue : colorTheme.whiteColor,
                  fontSize: FontSize.f15,
                  marginLeft: 10
                }}>
                  {item?.ModuleName}
                </Text>
              </Pressable>
            )}
          />
        ) : null}
      </ScrollView>
    {/* </View> */}
    </ImageBackground>
   
  );
};

export default Sidebar;

