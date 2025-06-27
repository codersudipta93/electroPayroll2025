import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Screens
import {
  DashDetails,
  Dashboard,
  AttendanceScreen,
  LeavelistScreen,
  PayslipScreen,
  LoanMainScreen,
  ExpanseScreen,
  AssetsScreen,
  IncomeTaxDashboard,
  YearlyIncome
} from '../Screens';

// Custom Sidebar
import Sidebar from '../Screens/sidebar';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <Sidebar {...props} />}
      screenOptions={{
        drawerType: 'slide',
        swipeEnabled: true,
        overlayColor: 'transparent',
        headerShown: false,
        sceneContainerStyle: {
          backgroundColor: 'transparent',
        },
      }}
    >
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="DashDetails" component={DashDetails} />
      <Drawer.Screen name="AttendanceScreen" component={AttendanceScreen} />
      <Drawer.Screen name="LeavelistScreen" component={LeavelistScreen} />
      <Drawer.Screen name="PayslipScreen" component={PayslipScreen} />
      <Drawer.Screen name="LoanMainScreen" component={LoanMainScreen} />
      <Drawer.Screen name="ExpanseScreen" component={ExpanseScreen} />
      <Drawer.Screen name="AssetsScreen" component={AssetsScreen} />
      <Drawer.Screen name="IncomeTaxDashboard" component={IncomeTaxDashboard} />
      <Drawer.Screen name="YearlyIncome" component={YearlyIncome} />



    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
