//import liraries
import {DrawerActions, useNavigation} from '@react-navigation/native';
import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {useTheme} from '../../Constants/Theme/Theme';
import Styles from './Style';
import Icon from 'react-native-vector-icons/Ionicons';
import {Icons, Images} from '../../Constants/ImageIconContant';
import {FontSize, FontFamily} from '../../Constants/Fonts';

// create a component
const Header = ({isShownHeaderLogo, headerTitle, onPress,ismenuShow,onPressHeader,powerbuttonClick,powerbuttonIconName,powerbuttonIconSize,showPowerButton,headerColor}) => {
  const navigation = useNavigation();
  const styles = Styles();
  const {colorTheme} = useTheme();
  return (
    
    <View style={[styles.container, !headerColor  && { backgroundColor: colorTheme.headerColor }]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        }}>
        <View
          style={{
            width: 50,
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {ismenuShow ? 
            <TouchableOpacity
            onPress={() => {navigation.openDrawer()}}
            // onPress={onPressHeader}
            style={{padding: 5}}>
            <Image source={Icons.sidemenu} style={{width:28,height:28}}/>
          </TouchableOpacity>
            :
            <TouchableOpacity
            // onPress={() => navigation.goBack()}
            onPress={onPress}
            style={{padding: 5}}>
            <Icon name="arrow-back" size={22} color={colorTheme.headerTextColor} />
          </TouchableOpacity>
          }
          
          
        </View>
        <View
          style={{
            flex: 1,
            height: '100%',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection:'row',
            marginLeft:10
          }}>
          {isShownHeaderLogo ? (
            <Image source={Icons.icon1} />
          ) : (
            <Text style={{color: colorTheme.headerTextColor, fontSize: FontSize.f16, fontFamily:"OutfitBold"}}>
              {headerTitle}
            </Text>
          )}
        </View>
        <View
          style={{
            width: 50,
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            {showPowerButton ? 
              <TouchableOpacity
                // onPress={() => navigation.goBack()}
                onPress={powerbuttonClick}
                style={{padding: 5}}>
                <Icon name={powerbuttonIconName ? powerbuttonIconName : 'power'} size={powerbuttonIconSize ? powerbuttonIconSize :20} color={colorTheme.headerTextColor} />
              </TouchableOpacity>
              :null
            }
            
          </View>
      </View>
    </View>
  );
};

//make this component available to the app
export default Header;
