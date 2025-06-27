import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import { FontFamily, FontSize } from '../Constants/Fonts';
import { useTheme } from '../Constants/Theme/Theme';
import { Images } from '../Constants/ImageIconContant';

const NotFound = ({ message = "Sorry! No Data Found"}) => {
  const { colorTheme } = useTheme();
  const styles = getStyles(colorTheme);

  return (
    <View style={styles.container}>
      <Image
        source={Images.notFoundImage}
        style={styles.image}
        resizeMode="contain"
      />
    
    </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingTop: 80,
  },
  image: {
    width: '100%',
    height: 280,
    marginBottom: 0
  },
  
});

export default NotFound;
