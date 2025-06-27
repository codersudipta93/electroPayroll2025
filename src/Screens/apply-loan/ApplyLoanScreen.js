import React, { Component, useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ScrollView,
    TextInput,
    ToastAndroid,
    ActivityIndicator,
    Image,
    KeyboardAvoidingView
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { DashDetails } from '../Screens';
import { getDataWithOutToken, postWithToken } from '../../Service/service';
import { useTheme } from '../../Constants/Theme/Theme';
import Styles from './Style';
import { ScreenLayout } from '../../Components';

import ActionSheet from "react-native-actions-sheet";
import { useIsFocused } from '@react-navigation/native';
import { setleaveBalance, setLeaveTypesReducers, clearLeaveTypesReducers } from '../../Store/Reducers/LeaveReducer';
import Icon from 'react-native-vector-icons/Ionicons';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { Images } from '../../Constants/ImageIconContant';
import { FontFamily } from '../../Constants/Fonts';

import { Dropdown } from 'react-native-element-dropdown';
import Snackbar from 'react-native-snackbar';

// create a component
const ApplyLoanScreen = props => {
    const { colorTheme } = useTheme()
    const styles = Styles();
    const dispatch = useDispatch();
    const { count } = useSelector(state => state.common);
    const actionSheetRef = useRef(null);

    const { employeeDetails, employeeApiUrl, token } = useSelector(state => state.common);

    const isFocused = useIsFocused();

    const [showStartDateCalender, setLoanDateCalender] = useState(false);

    const [isFocus, setIsFocus] = useState(false);
    const [loadingValue, setloadingValue] = useState(false);
    const [billerTypeData, setbillerTypeData] = useState([]);

    const [paymentStartYear, setpaymentStartYear] = useState("");
    const [paymentStartMonth, setpaymentStartMonth] = useState("");
    const [billerId, setbillerId] = useState("");
    const [documentNo, setdocumentNo] = useState('');
    const [loanDate, setLoanDate] = useState("");
    const [loanAmount, setloanAmount] = useState('');
    const [noOfInstallment, setnoOfInstallment] = useState('');
    const [emiAmount, setemiAmount] = useState('');
    const [priority, setPriorityValue] = useState("");
    const [paymentFrequency, setpaymentFrequencyValue] = useState("");

    const _applyloanfunction = () => {
        if (!loanDate) {
            showMsg("Please select loan date")
        } else if (!billerId) {
            showMsg("Please select biller type")
        } else if (!loanAmount.trim()) {
            showMsg("Please enter loan amount")
        } else if (!noOfInstallment.trim()) {
            showMsg("Please enter no of installment")
        } else if (!emiAmount.trim()) {
            showMsg("Please enter EMI amount")
        } else if (!paymentFrequency) {
            showMsg("Please select payment frequency")
        } else if (!paymentStartYear) {
            showMsg("Please select payment start year")
        } else if (!paymentStartMonth) {
            showMsg("Please select payment start month")
        } else {
            let pData = {
                "EmployeeId": employeeDetails?.EmployeeId,
                "Token": token,
                "LoanDate": loanDate,
                "BillerMasterId": billerId,
                "DocumentNo": documentNo,
                "EMIAmount": emiAmount,
                "LoanAmount": loanAmount,
                "NoOfInstallments": noOfInstallment,
                "PaymentFrequency": paymentFrequency,
                "PaymentStartMonth": paymentStartMonth,
                "PaymentStartYear": paymentStartYear,
                "Priority": priority

            }

            console.log(pData);
            setloadingValue(true);
            submitLoanApplication(pData);
        }
    }


    const submitLoanApplication = (data) => {
        postWithToken(employeeApiUrl, '/MyAdvanceApplicationInsert', data)
            .then((resp) => {
                console.log("MyAdvanceApplicationInsert : ", resp)
                setloadingValue(false);
                if (resp.Status == true) {
                    showMsg(resp.msg);
                    setTimeout(() => {
                        props.navigation.goBack();
                    }, 1000);
                } else {
                    showMsg(resp.msg)
                }
            })
            .catch((error) => {
                setloadingValue(false);
                showMsg(resp.msg)
                console.log("MyAdvanceApplicationInsert api error : ", error)
            })
    }

    const proritydata = [
        { label: 'Priority 1', value: '1' },
        { label: 'Priority 2', value: '2' },
    ];

    const monthData = [
        { label: 'January', value: '1' },
        { label: 'February', value: '2' },
        { label: 'March', value: '3' },
        { label: 'April', value: '4' },
        { label: 'May', value: '5' },
        { label: 'June', value: '6' },
        { label: 'July', value: '7' },
        { label: 'August', value: '8' },
        { label: 'September', value: '9' },
        { label: 'October', value: '10' },
        { label: 'November', value: '11' },
        { label: 'December', value: '12' },
    ];

    const yeardata = [
        { label: '2022', value: '2022' },
        { label: '2023', value: '2023' },
        { label: '2024', value: '2024' },
        { label: '2025', value: '2025' },
    ];

    const paymentFrequencyData = [
        { label: 'Monthly', value: '1' },
        { label: 'Bi-Monthly', value: '2' },
        { label: 'Quarterly', value: '3' },
        { label: 'Half Yearly', value: '6' },
        { label: 'Yearly', value: '12' },
    ];


    const renderDropdown = item => {
        return (
            <View style={styles.item}>
                <Text style={{ fontSize: 14, fontFamily: FontFamily.medium, color: '#000' }}>{item.label}</Text>
            </View>
        );
    };

    const renderBillerDropdown = item => {
        return (
            <View style={styles.item}>
                <Text style={{ fontSize: 14, fontFamily: FontFamily.medium, color: '#000' }}>{item.BillerName}</Text>
            </View>
        );
    };


    /* == Show Toast msg function == */
  const showMsg = (msg) => {
    Snackbar.show({
      text: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

    useEffect(() => {
        fetchLeaveBalance();
        // const dd = moment().subtract(0, 'days')
        // console.log("csdcsd" , dd)
    }, [isFocused])

    // ===== Convert date as yy-mm-dd format function =====
    const formatDate = ((date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('/');
    })



    fetchLeaveBalance = () => {
        let paramData = {
            // EmployeeId: employeeDetails?.EmployeeId,
            Token: token
        }
        postWithToken(employeeApiUrl, 'BillerList', paramData)
            .then((resp) => {
                console.log("/BillerList : ", resp.Data);
                if (resp.Status == true) {
                    // showMsg(resp.msg);
                    if (resp.Data) {
                        console.log("Leave Balance data ===> ", resp?.Data);
                        setbillerTypeData(resp?.Data)
                        // dispatch(setLeaveTypesReducers(resp.Data))
                        // setTimeout(() => {
                        //     console.log("leaveTypes : ", leaveTypesdata);
                        // }, 5000);
                        //setModalVisible(!modalVisible);
                    } else {

                    }
                } else {

                    showMsg(resp.msg)
                }
            })
            .catch((error) => {
                console.log("Leave balance api error : ", error)
            })
    }

    const clickOptionsheet = (item) => {
        console.log("Item : ", item)
        setLeaveType(item);
        // setTimeout(() => {
        actionSheetRef.current?.hide();
        // }, 1000);
    }

 

    return (
        <ScreenLayout
            isHeaderShown={true}
            isShownHeaderLogo={false}
            headerTitle="Apply loan"
            // enableScroll ={true}
            headerbackClick={() => { props.navigation.goBack() }}>
            <View style={{  flex:1, backgroundColor:colorTheme.headerColor }}>
                <KeyboardAvoidingView
                    behavior="padding"
                    keyboardVerticalOffset={15}
                    style={styles.customKeyboardAvoidingView}>
                    <ScrollView showsVerticalScrollIndicator={false} style={[styles.customScrollView,{borderTopLeftRadius: 12, borderTopRightRadius: 12,backgroundColor: colorTheme.shadeLight, height:'100%'}]}>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }} >
                            <View style={{ flex: 1, height: 48, marginLeft: 30, marginRight: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flex: 1, paddingRight: 10 }}>
                                    <TouchableOpacity
                                        // onPress={()=>actionSheetRef.current?.show()}
                                        onPress={() => setLoanDateCalender(true)}
                                        style={{
                                            flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: '#fff',
                                            borderWidth: 0.4,
                                            padding: 10, borderRadius: 5
                                        }}>
                                        <View>
                                            <Icon name="calendar-outline" size={18} color="#696969" />
                                        </View>
                                        <View style={{ flexDirection: 'column', justifyContent: 'center', paddingLeft: 5 }}>
                                            <Text style={{ fontFamily: FontFamily.medium, color: '#000' }}>{loanDate ? loanDate : 'Loan Date'}</Text>
                                        </View>

                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>

                        {/* start date calender */}
                        <DatePicker
                            modal
                            open={showStartDateCalender}
                            date={new Date()}
                            mode="date"
                            androidVariant="nativeAndroid"
                            textColor="#093b85"
                            cancelText="Close"
                            //minimumDate={moment().toDate()}
                            onConfirm={(selectedDate) => {
                                console.log(new Date(selectedDate));
                                const tempDate = formatDate(selectedDate)
                                // const tempDate = new Date(selectedDate)
                                setLoanDate(tempDate);
                                setLoanDateCalender(false);
                            }}
                            onCancel={() => {
                                setLoanDateCalender(false);
                            }}
                        />


                        <View style={{ marginTop: 12, marginLeft: 30, marginRight: 30, backgroundColor: '#fff', borderRadius: 8, }}>
                            <Dropdown
                                style={[styles.dropdown, isFocus && { borderColor: 'gray' }]}
                                placeholderStyle={[styles.placeholderStyle, { fontSize: 14, fontFamily: FontFamily.medium }]}
                                selectedTextStyle={[styles.selectedTextStyle, { fontSize: 14, fontFamily: FontFamily.medium }]}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={billerTypeData}
                                //search
                                maxHeight={200}
                                labelField="BillerName"
                                valueField="BillerMasterId"
                                placeholder={!isFocus ? 'Select Biller' : '...'}
                                //  searchPlaceholder="Search..."
                                value={priority}
                                // onFocus={() => setIsFocus(true)}
                                //onBlur={() => setIsFocus(false)}
                                renderItem={renderBillerDropdown}
                                dropdownPosition="auto"
                                onChange={item => {
                                    setbillerId(item.BillerMasterId);
                                    //  setIsFocus(false);
                                }}
                            />
                        </View>



                        <View style={{ borderWidth: 0.4, marginTop: 20, marginLeft: 30, marginRight: 30, borderRadius: 5, backgroundColor: '#fff', }}>
                            <TextInput
                                keyboardType='numeric'
                                // style={styles.input}
                                style={{ color: 'black', justifyContent: 'flex-start', paddingLeft: 10, fontFamily: FontFamily.medium, height:42 }}
                                //multiline={true}
                                onChangeText={text => {
                                    setloanAmount(text);
                                    if (text != '' && noOfInstallment) {
                                        let tempEMIAmount = (text / noOfInstallment).toFixed(2);
                                        console.log(tempEMIAmount)
                                        setemiAmount(tempEMIAmount.toString())
                                    } else {
                                        setemiAmount("")
                                    }
                                }}
                                maxLength={10}
                                value={loanAmount}
                                placeholder={"Loan amount"}
                                placeholderTextColor={'#000'}
                            />

                        </View>

                        <View style={{ borderWidth: 0.4, marginTop: 20, marginLeft: 30, marginRight: 30, borderRadius: 5, backgroundColor: '#fff', }}>
                            <TextInput
                                // style={styles.input}
                                keyboardType='numeric'
                                style={{ color: 'black', justifyContent: 'flex-start', paddingLeft: 10, fontFamily: FontFamily.medium, height:42 }}
                                //multiline={true}
                                onChangeText={text => {
                                    setnoOfInstallment(text);
                                    console.log(text)
                                    if (text != '' && loanAmount) {
                                        let tempEMIAmount = (loanAmount / text).toFixed(2);
                                        console.log(tempEMIAmount)
                                        setemiAmount(tempEMIAmount.toString())
                                    } else {
                                        setemiAmount("")
                                    }

                                }}

                                maxLength={5}
                                value={noOfInstallment}
                                placeholder={"No of installment"}
                                placeholderTextColor={'#000'}
                            />

                        </View>

                        <View style={{ borderWidth: 0.4, marginTop: 20, marginLeft: 30, marginRight: 30, borderRadius: 5, backgroundColor: '#fff', }}>
                            <TextInput
                                keyboardType='numeric'
                                editable={false}
                                // style={styles.input}
                                style={{ color: 'black', justifyContent: 'flex-start', paddingLeft: 10, fontFamily: FontFamily.medium, height:42 }}
                                //multiline={true}
                                onChangeText={text => setemiAmount(text)}
                                value={emiAmount}
                                placeholder={"EMI amount"}
                                placeholderTextColor={'#000'}
                            />

                        </View>



                        <View style={{ marginTop: 12, marginLeft: 30, marginRight: 30, backgroundColor: '#fff', borderRadius: 8, }}>
                            <Dropdown
                                style={[styles.dropdown, isFocus && { borderColor: 'gray' }]}
                                placeholderStyle={[styles.placeholderStyle, { fontSize: 14, fontFamily: FontFamily.medium }]}
                                selectedTextStyle={[styles.selectedTextStyle, { fontSize: 14, fontFamily: FontFamily.medium }]}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={paymentFrequencyData}
                                //search
                                maxHeight={200}
                                labelField="label"
                                valueField="value"
                                placeholder={!isFocus ? 'Payment Frequency' : '...'}
                                //  searchPlaceholder="Search..."
                                value={priority}
                                // onFocus={() => setIsFocus(true)}
                                //onBlur={() => setIsFocus(false)}
                                renderItem={renderDropdown}
                                dropdownPosition="auto"
                                onChange={item => {
                                    setpaymentFrequencyValue(item.value);
                                    //  setIsFocus(false);
                                }}


                            />
                        </View>
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingHorizontal: 28 }} >
                            <View style={{ width: '49%', backgroundColor: '#fff', borderRadius: 8, }}>
                                <Dropdown
                                    style={[styles.dropdown, isFocus && { borderColor: 'gray' }]}
                                    placeholderStyle={[styles.placeholderStyle, { fontSize: 12, fontFamily: FontFamily.medium }]}
                                    selectedTextStyle={[styles.selectedTextStyle, { fontSize: 14, fontFamily: FontFamily.medium }]}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={yeardata}
                                    //search
                                    maxHeight={200}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={!isFocus ? 'Payment start year' : '...'}
                                    //  searchPlaceholder="Search..."
                                    value={paymentStartYear}
                                    // onFocus={() => setIsFocus(true)}
                                    // onBlur={() => setIsFocus(false)}
                                    renderItem={renderDropdown}
                                    dropdownPosition="auto"
                                    onChange={item => {
                                        setpaymentStartYear(item.value);
                                        setIsFocus(false);
                                    }}


                                />
                            </View>

                            <View style={{ width: '49%', backgroundColor: '#fff', borderRadius: 8, }}>
                                <Dropdown
                                    style={[styles.dropdown, isFocus && { borderColor: 'gray' }]}
                                    placeholderStyle={[styles.placeholderStyle, { fontSize: 12, fontFamily: FontFamily.medium }]}
                                    selectedTextStyle={[styles.selectedTextStyle, { fontSize: 14, fontFamily: FontFamily.medium }]}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={monthData}
                                    //search
                                    maxHeight={200}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={!isFocus ? 'Payment start month' : '...'}
                                    //  searchPlaceholder="Search..."
                                    value={paymentStartMonth}
                                    // onFocus={() => setIsFocus(true)}
                                    //onBlur={() => setIsFocus(false)}
                                    renderItem={renderDropdown}
                                    dropdownPosition="auto"
                                    onChange={item => {
                                        setpaymentStartMonth(item.value);
                                        // setIsFocus(false);
                                    }}


                                />
                            </View>


                        </View>

                        <View style={{ borderWidth: 0.4, marginTop: 20, marginLeft: 30, marginRight: 30, borderRadius: 5, backgroundColor: '#fff', }}>
                            <TextInput

                                // style={styles.input}
                                style={{ color: 'black', justifyContent: 'flex-start', paddingLeft: 10, fontFamily: FontFamily.medium, height:44 }}
                                //multiline={true}
                                onChangeText={text => setdocumentNo(text)}
                                value={documentNo}
                                placeholder={"Document Number"}
                                placeholderTextColor={'#000'}
                            />

                        </View>

                        <View style={{ marginTop: 20, marginLeft: 30, marginRight: 30, backgroundColor: '#fff', borderRadius: 8, }}>
                            <Dropdown
                                style={[styles.dropdown, isFocus && { borderColor: 'gray' }]}
                                placeholderStyle={[styles.placeholderStyle, { fontSize: 14, fontFamily: FontFamily.medium }]}
                                selectedTextStyle={[styles.selectedTextStyle, { fontSize: 14, fontFamily: FontFamily.medium }]}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={proritydata}
                                //search
                                maxHeight={200}
                                labelField="label"
                                valueField="value"
                                placeholder={!isFocus ? 'Select Priority' : '...'}
                                //  searchPlaceholder="Search..."
                                value={priority}
                                // onFocus={() => setIsFocus(true)}
                                //onBlur={() => setIsFocus(false)}
                                renderItem={renderDropdown}
                                dropdownPosition="auto"
                                onChange={item => {
                                    setPriorityValue(item.value);
                                    //  setIsFocus(false);
                                }}


                            />
                        </View>

                        {/* button */}
                        <View style={{ marginTop: 30, marginBottom:20 }}>
                            <TouchableOpacity
                                onPress={() => { _applyloanfunction() }}
                                style={{ height: 48, backgroundColor: colorTheme.headerColor, marginLeft: 30, marginRight: 30, borderRadius: 5, flexDirection: 'column', justifyContent: 'center' }}
                            >
                                {loadingValue
                                    ?
                                    <ActivityIndicator
                                        animating={true}
                                        hidesWhenStopped={true}
                                        color={colorTheme.whiteColor}
                                    ></ActivityIndicator>
                                    :
                                    <Text style={{ textAlign: 'center', color: '#fff', fontFamily: FontFamily.medium }}>Apply loan</Text>
                                }
                            </TouchableOpacity>

                        </View>

                    </ScrollView>

                </KeyboardAvoidingView>
            </View>
        </ScreenLayout>
    );
};

//make this component available to the app
export default ApplyLoanScreen;
