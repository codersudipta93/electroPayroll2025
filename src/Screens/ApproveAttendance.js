import React, { Component, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Modal,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    RefreshControl,
    ActivityIndicator,
    ToastAndroid,
    Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
import { Loader, NotFound, ScreenLayout } from '../Components';
import { FontFamily, FontSize } from '../Constants/Fonts';
import { Icons, Images } from '../Constants/ImageIconContant';
import { useDispatch, useSelector } from 'react-redux';
import { getDataWithToken, postWithToken } from '../Service/service';
import { Image } from 'react-native-animatable';
import { ConfirmationModal } from '../Components/confirmationModal';
import { deleteData, getData } from '../Service/localStorage';
import Snackbar from 'react-native-snackbar';

import {
 clearEmpAndCompanyDetails
} from '../Store/Reducers/CommonReducer';
import LinearGradient from 'react-native-linear-gradient';

const ApproveAttendance = props => {
    const dispatch = useDispatch();
    const { employeeDetails, employeeApiUrl, token } = useSelector(state => state.common);
    const [refreshing, setRefreshing] = React.useState(false);
    const [loader, setloader] = React.useState(false);

    const [attendanceAprovalData, setattendanceAprovalData] = useState([]);
    const [logoutModal, setLogoutModal] = React.useState(false);
    // State for reject reason modal
    const [rejectModalVisible, setRejectModalVisible] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [selectedItem, setSelectedItem] = useState("");

    // Handle approve action
    const handleApprove = (item) => {
        // Add your approval logic here
        console.log("Approved:", item);
        handleApproveApi(item)
    };



    const handleApproveApi = (item) => {

        let param = {
            "EmployeeId": employeeDetails?.EmployeeId,
            "Token": token,
            "AttendanceApprovalId": item?.AttendanceApprovalId,
            "IsReject": "0",
            "RejectReason": ""
        }

        //console.log(param)
        Alert.alert('Alert!', 'Are you sure you want to Approve?', [
            {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
            },
            {
                text: 'YES', onPress: () => {
                    ApproveAttendanceApplication(param)

                }
            },
        ]);
        return true;
    };


    const ApproveAttendanceApplication = (param) => {
        //console.log(param)
        setloader(true)
        postWithToken(employeeApiUrl, 'ApproveAttendanceApplication', param)
            .then((resp) => {
                setloader(false)
                if (resp.Status == true) {
                    showMsg(resp.msg);
                    if (resp.Data) {
                        console.log("data ===> ", resp?.Data);
                        fetchMyAttendanceApprovalList(null)
                        setRejectModalVisible(false);
                    } else {
                        showMsg(resp.msg)
                        setRejectModalVisible(false);
                    }
                } else {
                    console.log("data ===> ", resp?.Data);
                    setRejectModalVisible(false);
                    showMsg(resp.msg)
                }
            })
            .catch((error) => {
                setloader(false)
                console.log("api error : ", error);
                setRejectModalVisible(false);
            })
    }

    // Handle reject button press - opens the modal
    const handleRejectPress = (item) => {
        setSelectedItem(item);
        setRejectReason("");
        setRejectModalVisible(true);
    };

    // Handle final rejection with reason
    const submitReject = () => {

        if (selectedItem) {

            let param = {
                "EmployeeId": employeeDetails?.EmployeeId,
                "Token": token,
                "AttendanceApprovalId": selectedItem?.AttendanceApprovalId,
                "IsReject": "1",
                "RejectReason": rejectReason
            }

            // console.log(param)

            ApproveAttendanceApplication(param)

        }
    };

    useEffect(() => {
        fetchMyAttendanceApprovalList(null)
    }, [])

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
    const showMsg = (msg) => {
    Snackbar.show({
      text: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }


    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => {
            fetchMyAttendanceApprovalList('pullToRefresh')
            setRefreshing(false)
        });
    }, []);


    /*== Logout functionality start === */
  const singOutFunc = () => {
    dispatch(clearEmpAndCompanyDetails())
    deleteData();
    setTimeout(() => {
      props.navigation.replace('CompanyLogin');
    }, 400);
  }


    const fetchMyAttendanceApprovalList = (event) => {
        event == null ? setloader(true) : setloader(false)
        let paramData = {
            EmployeeId: employeeDetails?.EmployeeId,
            Token: token
        }

        postWithToken(employeeApiUrl, 'MyAttendanceApprovalList', paramData)
            .then((resp) => {
                event == null ? setloader(false) : setloader(false)
                if (resp.Status == true) {
                    showMsg(resp.msg);
                    if (resp.Data) {
                        console.log("data ===> ", resp?.Data);
                        //("syccess")
                        setattendanceAprovalData(resp.Data)
                        //setModalVisible(!modalVisible);
                    } else { setattendanceAprovalData([]) }
                } else {
                    console.log("data ===> ", resp?.Data);
                    setattendanceAprovalData([])
                    showMsg(resp.msg)
                }
            })
            .catch((error) => {
                console.log("api error : ", error)
            })
    }

    return (
        <ScreenLayout
            isHeaderShown={true}
            isShownHeaderLogo={false}
            headerTitle="Approve Attendance"
            headerbackClick={() => { props.navigation.goBack() }}>
            <View style={{ backgroundColor: loader == false & attendanceAprovalData == "" ? '#fff' : '#ebf0f9', flex: 1, borderTopLeftRadius: 12, borderTopRightRadius: 12, }}>

                {loader == false & attendanceAprovalData == "" ?

                    <NotFound />

                    : null

                }
                <FlatList
                    data={attendanceAprovalData}
                    renderItem={({ item, index }) => (
                         <LinearGradient colors={["#e6b5fd",  "#fff","#fff"]} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={[styles.card, { marginBottom: index == attendanceAprovalData.length - 1 ? 20 : 0 }]}>
                            <View style={styles.header}>
                                <View style={styles.headerLeft}>
                                    <Text style={styles.title}>{item?.EmployeeName}</Text>
                                </View>
                               
                            </View>

                            <View style={styles.infoSection}>
                                <View style={styles.infoRow}>
                                    <View style={[styles.infoItem]}>
                                        <Text style={styles.infoLabel}>Application Date</Text>
                                        <Text style={styles.infoValue}>{item.ApplicationDate}</Text>
                                    </View>
                                </View>

                                <View style={styles.infoRow}>
                                    <View style={[styles.infoItem, { width: '70%' }]}>
                                        <Text style={styles.infoLabel}>Punch Date & Time</Text>
                                        <Text style={styles.infoValue}>
                                            {item.Edatetime}
                                        </Text>
                                    </View>
                                    <View style={[styles.infoItem, { width: '30%' }]}>
                                        <Text style={styles.infoLabel}>Punch Type</Text>
                                        <Text style={styles.infoValue}>{item.IOType || 'N/A'}</Text>
                                    </View>
                                </View>

                                <View style={styles.reasonSection}>
                                    <Text style={styles.infoLabel}>Reason</Text>
                                    <Text style={styles.reasonText}>{item.Reason || 'No reason provided'}</Text>
                                </View>

                                {item.RejectReason && (
                                    <View style={styles.rejectReasonSection}>
                                        <Text style={styles.infoLabel}>Rejection Reason</Text>
                                        <Text style={[styles.reasonText, styles.rejectText]}>{item.RejectReason}</Text>
                                    </View>
                                )}
                            </View>


                            <View style={styles.footer}>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.approveButton]}
                                    onPress={() => handleApprove(item)}
                                >
                                    <Icon name="checkmark-circle" size={18} color="#fff" />
                                    <Text style={styles.buttonText}>Approve</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.actionButton, styles.rejectButton]}
                                    onPress={() => handleRejectPress(item)}
                                >
                                    <Icon name="close-circle" size={18} color="#fff" />
                                    <Text style={styles.buttonText}>Reject</Text>
                                </TouchableOpacity>
                            </View>

                        </LinearGradient>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                    style={{ marginTop: 10, borderColor: '#004792' }}
                />
            </View>
            {/* Reject Reason Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={rejectModalVisible}
                onRequestClose={() => setRejectModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={[styles.modalTitle,{}]}>Rejection Reason</Text>
                            <Text style={styles.modalSubtitle}>Please provide a reason for rejection</Text>

                            <TextInput
                                style={styles.reasonInput}
                                placeholder="Enter rejection reason"
                                value={rejectReason}
                                onChangeText={setRejectReason}
                                multiline={true}
                                numberOfLines={4}
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setRejectModalVisible(false)}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.modalButton,
                                        styles.submitButton,
                                        !rejectReason.trim() && styles.disabledButton
                                    ]}
                                    onPress={submitReject}
                                    disabled={!rejectReason.trim()}
                                >
                                    <Text style={styles.submitButtonText}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            <Loader visible={loader} />

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

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
       // padding: 16,
        marginVertical: 8,
        marginTop: 12,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        marginHorizontal:12,
        marginTop:12
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 14,
        fontFamily: FontFamily.bold,
        fontWeight: '600',
        color: "#440067",
    },
    subtitle: {
        fontSize: 12,
        fontFamily: FontFamily.bold,
        color: '#757575',
        marginLeft: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
        fontFamily: FontFamily.medium,
    },
    infoSection: {
        marginBottom: 16,
        marginHorizontal:12
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 12,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    infoItem: {
        // flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        fontFamily: FontFamily.medium,
        color: '#440067',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 14,
        color: "#440067",
        fontWeight: '500',
        fontFamily: FontFamily.medium,
    },
    reasonSection: {
        marginTop: 4,
    },
    rejectReasonSection: {
        marginTop: 12,
    },
    reasonText: {
        fontSize: 14,
        fontFamily: FontFamily.medium,
        color: "#440067",
        backgroundColor: '#eee8fd',
        padding: 12,
        borderRadius: 8,
        marginTop: 4,
    },
    rejectText: {
        backgroundColor: '#FFEBEE',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        marginHorizontal:12,
        marginBottom:10
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        width: '48%',
    },
    approveButton: {
        backgroundColor: '#4CAF50',
    },
    rejectButton: {
        backgroundColor: '#F44336',
    },
    buttonText: {
        color: '#fff',
        fontFamily: FontFamily.medium,
        fontSize: 14,
        marginLeft: 6,
        fontWeight: '500',
    },

    // Modal styles
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: FontFamily.bold,
        color: "#440067",
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 14,
        fontFamily: FontFamily.regular,
        color: '#757575',
        marginBottom: 16,
    },
    reasonInput: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        fontFamily: FontFamily.regular,
        color: '#212121',
        backgroundColor: '#F5F5F5',
        textAlignVertical: 'top',
        minHeight: 100,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginLeft: 12,
    },
    cancelButton: {
        backgroundColor: '#F5F5F5',
    },
    cancelButtonText: {
        color: '#757575',
        fontFamily: FontFamily.medium,
        fontSize: 14,
    },
    submitButton: {
        backgroundColor: '#F44336',
    },
    disabledButton: {
        backgroundColor: '#E0E0E0',
    },
    submitButtonText: {
        color: '#fff',
        fontFamily: FontFamily.medium,
        fontSize: 14,
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#rgba(0, 0, 0, 0.5)',
        zIndex: 1000
    },
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 40,
        width: 40,
        borderRadius: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
});

export default ApproveAttendance;