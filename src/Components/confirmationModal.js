import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
//import { useTheme } from '../Constants/Theme';
//import { fontFamily, sizes, device, local_images } from "../Constants"; // Import font constants


export const ConfirmationModal = ({ visible, title, msg, confrimBtnText, onConfirm, onCancel, onCancelBtnHide, }) => {
  //const { toggleTheme, isDark, theme } = useTheme();
  //const styles = getStyles(theme, isDark);

  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={visible}
      onRequestClose={onCancel} // Handles the back button press on Android
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{msg}</Text>
          <View style={styles.buttonContainer}>
            {onCancelBtnHide ? null :
              <TouchableOpacity onPress={onCancel} style={[styles.button, styles.cancelButton]}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            }
            <TouchableOpacity onPress={onConfirm} style={[styles.button, styles.confirmButton]}>
              <Text style={styles.buttonText}>{confrimBtnText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    //fontFamily:fontFamily.bold
  },
  message: {
    fontSize: 14.5,
    marginBottom: 20,
    textAlign: 'center',
    //fontFamily:fontFamily.medium
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  confirmButton: {
    backgroundColor: "#440067",
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    //fontFamily:fontFamily.medium
  },
});


