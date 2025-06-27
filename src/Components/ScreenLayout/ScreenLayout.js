import React from 'react';
import { View, StatusBar, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../Constants/Theme/Theme';
import Header from '../Header/Header';
import Styles from './Style';

const ScreenLayout = ({
  isHeaderShown,
  isShownHeaderLogo, 
  headerTitle,
  children,
  headerbackClick,
  headermenuClick,
  showpowerButton,
  powerbuttonIconName,
  powerbuttonIconSize,
  clickPowerbutton,
  hamburgmenuVisable,
  headerColor
}) => {
  const { colorTheme } = useTheme();
  const styles = Styles();
  const insets = useSafeAreaInsets(); // get top safe padding for iPhone

  const getTopPadding = () => {
    if (Platform.OS === 'ios') {
      return insets.top; // safe area inset on iPhone
    }
    return StatusBar.currentHeight || 0; // statusbar height on Android
  };

  return (
    <>
      {/* Make StatusBar translucent */}
    

      <SafeAreaView style={{ flex: 1, backgroundColor: colorTheme.headerColor }} edges={['top', 'bottom', 'left', 'right']}>
        {isHeaderShown && (
          <View style={{  }}>
            <Header
              isShownHeaderLogo={isShownHeaderLogo}
              headerTitle={headerTitle}
              onPress={headerbackClick}
              onPressHeader={headermenuClick}
              showPowerButton={showpowerButton}
              powerbuttonClick={clickPowerbutton}
              powerbuttonIconName={powerbuttonIconName}
              powerbuttonIconSize={powerbuttonIconSize}
              ismenuShow={hamburgmenuVisable}
              headerColor={headerColor}
            />
          </View>
        )}

        <View style={{ flex: 1 }}>
          {children}
        </View>
      </SafeAreaView>
    </>
  );
};

export default ScreenLayout;
