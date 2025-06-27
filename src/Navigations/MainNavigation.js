import React from 'react';

import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';

import DrawerNavigation from './DrawerNavigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '../Constants/Theme/Theme';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import {
  AddexpanseScreen,
  ApplyApplicationScreen,
  ApplyLeaveScreen,
  ApproveLeaveScreen,
  AttendanceRepport,
  AttendanceDashboard,
  AttendanceScreen,
  CompanyLogin,
  DashDetails,
  EmployeeLogin,
  ExpanseScreen,
  Initial,
  LeaveBalanceScreen,
  LeavelistScreen,
  PayslipScreen,
  ProfileScreen,
  AssetsScreen,
  ApplyLoanScreen,
  LoanMainScreen,
  Holiday,
  Regularization,
  OTApplication,
  AttendanceApplicationStatus,
  ApproveAttendance,
  IncomeTaxDashboard,
  ITDeclaration,
  YearlyIncome
} from '../Screens';

const Stack = createStackNavigator();

const MainNavigation = props => {
  //const { colorTheme } = useTheme();
  const dispatch = useDispatch();
  const { isStackHeaderVisible } = useSelector(state => state.common);

  // const horizontalAnimation = {
  //   gestureDirection: 'horizontal',
  //   cardStyleInterpolator: ({ current, layouts }) => {
  //     return {
  //       cardStyle: {
  //         transform: [
  //           {
  //             translateX: current.progress.interpolate({
  //               inputRange: [0, 1],
  //               outputRange: [layouts.screen.width, 0],
  //             }),
  //           },
  //         ],
  //       },
  //     };
  //   },
  // };

  // const verticalAnimation = {
  //   gestureDirection: 'vertical',
  //   cardStyleInterpolator: ({ current, layouts }) => {
  //     return {
  //       cardStyle: {
  //         transform: [
  //           {
  //             translateY: current.progress.interpolate({
  //               inputRange: [0, 1],
  //               outputRange: [layouts.screen.height, 0],
  //             }),
  //           },
  //         ],
  //       },
  //     };
  //   },
  // };

  // const verticalAnimationdd = {
  //   gestureDirection: 'vertical',
  //   cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
  // };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {
          //backgroundColor: colorTheme.backGroundColor,
        },
        headerShadowVisible: false,
        // cardStyleInterpolator:CardStyleInterpolators.forFadeFromCenter
        // cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS
      }}>


      <Stack.Screen name="Initial" component={Initial} options={{headerShown:false}} />
      {/* Authentication screen */}
      <Stack.Screen name="CompanyLogin" component={CompanyLogin} options={{headerShown:false,animation:'slide_from_right'}} />
      <Stack.Screen name="EmployeeLogin" component={EmployeeLogin} options={{headerShown:false,animation:'slide_from_right'}} />

      <Stack.Screen name="Home" component={DrawerNavigation} options={{headerShown:false,animation:'slide_from_right'}}/>

      {/* <Stack.Screen
        name="SignUp"
        component={SignUp}
        // options={{headerTitle: ''}}
      /> */}




      <Stack.Screen name="DashDetails" component={DashDetails} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="PayslipScreen" component={PayslipScreen} />
      <Stack.Screen name="AttendanceScreen" component={AttendanceScreen} />
      <Stack.Screen name="AttendanceRepport" component={AttendanceRepport} />
      <Stack.Screen name="AttendanceDashboard" component={AttendanceDashboard} />

      <Stack.Screen name="IncomeTaxDashboard" component={IncomeTaxDashboard} />
      <Stack.Screen name="ITDeclaration" component={ITDeclaration} />

      <Stack.Screen name="ExpanseScreen" component={ExpanseScreen} />
      <Stack.Screen name="AddexpanseScreen" component={AddexpanseScreen} />
      {/* Leave related screens */}
      <Stack.Screen name="LeavelistScreen" component={LeavelistScreen} />
      <Stack.Screen name="ApplyLeaveScreen" component={ApplyLeaveScreen} />
      <Stack.Screen name="ApplyApplicationScreen" component={ApplyApplicationScreen} />
      <Stack.Screen name="LeaveBalanceScreen" component={LeaveBalanceScreen} />
      <Stack.Screen name="ApproveLeaveScreen" component={ApproveLeaveScreen} />

      <Stack.Screen name="AssetsScreen" component={AssetsScreen} />
      <Stack.Screen name="ApplyLoanScreen" component={ApplyLoanScreen} />
      <Stack.Screen name="LoanMainScreen" component={LoanMainScreen} />
      <Stack.Screen name="Holiday" component={Holiday} />
      <Stack.Screen name="Regularization" component={Regularization} />
      <Stack.Screen name="OTApplication" component={OTApplication} />
      <Stack.Screen name="AttendanceApplicationStatus" component={AttendanceApplicationStatus} />
      <Stack.Screen name="ApproveAttendance" component={ApproveAttendance} />
      <Stack.Screen name="YearlyIncome" component={YearlyIncome} />
      
      
      


    </Stack.Navigator>
  );
};
export default MainNavigation;
