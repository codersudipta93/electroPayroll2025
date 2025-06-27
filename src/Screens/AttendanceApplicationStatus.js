import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, FlatList, Modal, Pressable, Image, RefreshControl, ToastAndroid } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons'
import { Loader, NotFound, ScreenLayout } from '../Components';
import { FontFamily, FontSize } from '../Constants/Fonts';
import { useDispatch, useSelector } from 'react-redux';
import { getDataWithToken, postWithToken } from '../Service/service';
import LinearGradient from 'react-native-linear-gradient';
import Snackbar from 'react-native-snackbar';

const AttendanceApplicationStatus = props => {
    const dispatch = useDispatch();
    const { employeeDetails, employeeApiUrl, token } = useSelector(state => state.common);
    const [refreshing, setRefreshing] = React.useState(false);
    const [loader, setloader] = React.useState(false);
    const [attendanceData, setattendanceData] = useState([])


    // Get appropriate status color
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return '#4CAF50';
            case 'rejected':
                return '#F44336';
            case 'under process':
                return '#FF9800';
            default:
                return '#757575';
        }
    };

    const showMsg = (msg) => {
        Snackbar.show({
            text: msg,
            duration: Snackbar.LENGTH_SHORT,
        });
    }


    useEffect(() => {
        fetchMyAttendanceApplicationList(null)
    }, [])

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => {
            fetchMyAttendanceApplicationList('pullToRefresh')
            setRefreshing(false)
        });
    }, []);

    const fetchMyAttendanceApplicationList = (event) => {
        event == null ? setloader(true) : setloader(false)
        let paramData = {
            EmployeeId: employeeDetails?.EmployeeId,
            Token: token
        }

        postWithToken(employeeApiUrl, 'MyAttendanceApplicationList', paramData)
            .then((resp) => {
                event == null ? setloader(false) : setloader(false)
                if (resp.Status == true) {
                    // showMsg(resp.msg);
                    if (resp.Data) {
                        console.log(" data ===> ", resp?.Data);
                        setattendanceData(resp.Data)
                        //setModalVisible(!modalVisible);
                    } else { setattendanceData([]) }
                } else {
                    setattendanceData([])
                    showMsg(resp.msg)
                }
            })
            .catch((error) => {
                console.log("Leave balance api error : ", error)
            })
    }

    return (
        <ScreenLayout
            isHeaderShown={true}
            isShownHeaderLogo={false}
            headerTitle="Applications Status"
            headerbackClick={() => { props.navigation.goBack() }}>


            <View style={{
                backgroundColor: attendanceData ? '#ebf0f9' : '#fff', flex: 1, borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
            }}>
                {loader == false & attendanceData == "" ?
                    <NotFound />
                    : null}

                <FlatList
                    data={attendanceData}
                    renderItem={({ item, index }) => (
                        <LinearGradient colors={["#e6b5fd", "#fff", "#fff"]} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={[styles.card, { marginBottom: index == attendanceData.length - 1 ? 20 : 0 }]}>
                            <View style={[styles.header, {marginTop:12}]}>
                                <View style={[styles.infoItem, { marginVertical: 0, paddingVertical: 4 }]}>
                                    <Text style={styles.infoLabel}>Application Date</Text>
                                    <Text style={styles.infoValue}>{item.ApplicationDate}</Text>
                                </View>
                                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.ApplicationStatus) }]}>
                                    <Text style={styles.statusText}>{item.ApplicationStatus || 'Processing'}</Text>
                                </View>
                            </View>

                            <View style={styles.infoSection}>
                                <View style={styles.infoRow}>
                                    <View style={[styles.infoItem, { width: '70%' }]}>
                                        <Text style={styles.infoLabel}>Requested Punch Date & Time</Text>
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
                            </View>
                        </LinearGradient>
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                    style={{ marginTop: 10, borderColor: '#004792', }}
                />
            </View>


            <Loader visible={loader} />
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        //padding: 16,
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
        marginBottom: 16,
        marginHorizontal:12
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 14,
        fontFamily: FontFamily.bold,
        fontWeight: '600',
        color: '#212121',
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
        color: "#440067",
        marginBottom: 5,
    },
    infoValue: {
        fontSize: 14,
        color: "#440067",
        fontWeight: '500',
        fontFamily: FontFamily.bold,
    },
    reasonSection: {
        marginTop: 10,
        marginHorizontal:0
    },
    reasonText: {
        fontSize: 14,
        fontFamily: FontFamily.medium,
        color: '#440067',
        backgroundColor: '#eee8fd',
        padding: 12,
        borderRadius: 8,
        marginTop: 4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 12,
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

export default AttendanceApplicationStatus;