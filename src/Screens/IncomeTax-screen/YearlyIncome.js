




import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    FlatList,
    Pressable,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

import { ScreenLayout } from '../../Components';
import { useTheme } from '../../Constants/Theme/Theme';
import { deleteData } from '../../Service/localStorage';
import { clearEmpAndCompanyDetails } from '../../Store/Reducers/CommonReducer';
 
import { FontFamily, FontSize } from '../../Constants/Fonts';
import { windowHeight, windowWidth } from '../../Constants/window';

const YearlyIncome = props => {
    const { colorTheme } = useTheme();
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const styles = getStyles(colorTheme);

    const [logoutModal, setLogoutModal] = useState(false);
    const [scrollX, setScrollX] = useState(0);
    const headerScrollRef = useRef(null);
    const bodyScrollRef = useRef(null);

    const componentArray = [
        "Basic", "HRA", "Fuel Allow", "Washing Allow", "Allowance",
        "Education Allow", "Arrear", "Gross Salary", "PF", "VPF",
        "P Tax", "TDS", "LWF", "Gross Deduction", "TDS", "LWF", "Gross Deduction"
    ];


    const dataSample = [
        {
            component:"Basic"
        }
    ]


    const salaryData = [
        {
            month: "06-2025",
            basic: 6000, 
            hra: 3000,
            fuelAllow: 500,
            washingAllow: 1200,
            educationAllow: 600,
            allowance: 700,
            arrear: 0,
            grossSalary: 13000,
            pf: 550,
            vpf: 0,
            pTax: 0,
            tds: 0,
            lwf: 0,
            grossDeduction: 550,
        },
        {
            month: "May-2025",
            basic: 6000,
            hra: 3000,
            fuelAllow: 500,
            washingAllow: 1200,
            educationAllow: 600,
            allowance: 700,
            arrear: 0,
            grossSalary: 13000,
            pf: 550,
            vpf: 0,
            pTax: 0,
            tds: 0,
            lwf: 0,
            grossDeduction: 550,
        },
        {
            month: "Jun-2025",
            basic: 6000,
            hra: 3000,
            fuelAllow: 500,
            washingAllow: 1200,
            educationAllow: 600,
            allowance: 700,
            arrear: 0,
            grossSalary: 13000,
            pf: 550,
            vpf: 0,
            pTax: 0,
            tds: 0,
            lwf: 0,
            grossDeduction: 550,
        },
        {
            month: "Jul-2025",
            basic: 6000,
            hra: 3000,
            fuelAllow: 500,
            washingAllow: 1200,
            educationAllow: 600,
            allowance: 700,
            arrear: 0,
            grossSalary: 13000,
            pf: 550,
            vpf: 0,
            pTax: 0,
            tds: 0,
            lwf: 0,
            grossDeduction: 550,
        },
        {
            month: "Aug-2025",
            basic: 6000,
            hra: 3000,
            fuelAllow: 500,
            washingAllow: 1200,
            educationAllow: 600,
            allowance: 700,
            arrear: 0,
            grossSalary: 13000,
            pf: 550,
            vpf: 0,
            pTax: 0,
            tds: 0,
            lwf: 0,
            grossDeduction: 550,
        },
        {
            month: "Sep-2025",
            basic: 6000,
            hra: 3000,
            fuelAllow: 500,
            washingAllow: 1200,
            educationAllow: 600,
            allowance: 700,
            arrear: 0,
            grossSalary: 13000,
            pf: 550,
            vpf: 0,
            pTax: 0,
            tds: 0,
            lwf: 0,
            grossDeduction: 550,
        },
        {
            month: "Oct-2025",
            basic: 6000,
            hra: 3000,
            fuelAllow: 500,
            washingAllow: 1200,
            educationAllow: 600,
            allowance: 700,
            arrear: 0,
            grossSalary: 13000,
            pf: 550,
            vpf: 0,
            pTax: 0,
            tds: 0,
            lwf: 0,
            grossDeduction: 550,
        },
        {
            month: "Nov-2025",
            basic: 6000,
            hra: 3000,
            fuelAllow: 500,
            washingAllow: 1200,
            educationAllow: 600,
            allowance: 700,
            arrear: 0,
            grossSalary: 13000,
            pf: 550,
            vpf: 0,
            pTax: 0,
            tds: 0,
            lwf: 0,
            grossDeduction: 550,
        },
        {
            month: "Dec-2025",
            basic: 6000,
            hra: 3000,
            fuelAllow: 500,
            washingAllow: 1200,
            educationAllow: 600,
            allowance: 700,
            arrear: 0,
            grossSalary: 13000,
            pf: 550,
            vpf: 0,
            pTax: 0,
            tds: 0,
            lwf: 0,
            grossDeduction: 550,
        },
        {
            month: "Jan-2026",
            basic: 6000,
            hra: 3000,
            fuelAllow: 500,
            washingAllow: 1200,
            educationAllow: 600,
            allowance: 700,
            arrear: 0,
            grossSalary: 13000,
            pf: 550,
            vpf: 0,
            pTax: 0,
            tds: 0,
            lwf: 0,
            grossDeduction: 550,
        },
        {
            month: "Feb-2026",
            basic: 6000,
            hra: 3000,
            fuelAllow: 500,
            washingAllow: 1200,
            educationAllow: 600,
            allowance: 700,
            arrear: 0,
            grossSalary: 13000,
            pf: 550,
            vpf: 0,
            pTax: 0,
            tds: 0,
            lwf: 0,
            grossDeduction: 550,
        },
        {
            month: "Mar-2026",
            basic: 6000,
            hra: 3000,
            fuelAllow: 500,
            washingAllow: 1200,
            educationAllow: 600,
            allowance: 700,
            arrear: 0,
            grossSalary: 13000,
            pf: 550,
            vpf: 0,
            pTax: 0,
            tds: 0,
            lwf: 0,
            grossDeduction: 550,
        },
    ];

    const handleScroll = (event) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        setScrollX(offsetX);

        // Update the other scroll view
        if (event.currentTarget === headerScrollRef.current?.getScrollableNode()) {
            bodyScrollRef.current?.scrollTo({ x: offsetX, animated: false });
        } else {
            headerScrollRef.current?.scrollTo({ x: offsetX, animated: false });
        }
    };

    const signOut = () => {
        dispatch(clearEmpAndCompanyDetails());
        deleteData();
        setTimeout(() => {
            props.navigation.replace('CompanyLogin');
        }, 400);
    };

    const renderFixedHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.leftHeaderCell}>
                <Text style={styles.headerText}>Component</Text>
            </View>

            <ScrollView
                ref={headerScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.rightHeaderContainer}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentOffset={{ x: scrollX, y: 0 }}
            >
                {salaryData.map((item, index) => (
                    <View key={index} style={styles.rightHeaderCell}>
                        <Text style={styles.headerText}>{item.month}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );

    const renderScrollableContent = () => (
        <View style={styles.bodyContainer}>
            <View style={styles.leftBodyColumn}>
                <FlatList
                    data={componentArray}
                    renderItem={({ item, index }) => (
                        <View style={styles.leftBodyCell}>
                            <Text style={styles.leftBodyText}>{item}</Text>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEnabled={false}
                />
            </View>

            <ScrollView
                ref={bodyScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.rightBodyContainer}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentOffset={{ x: scrollX, y: 0 }}
            >
                {salaryData.map((salaryItem, salaryIndex) => (
                    <View key={salaryIndex} style={styles.rightBodyColumn}>
                        {['basic', 'hra', 'fuelAllow', 'washingAllow', 'allowance', 'educationAllow', 'arrear', 'grossSalary', 'pf', 'vpf', 'pTax', 'tds', 'lwf', 'grossDeduction', "TDS", "LWF", "Gross Deduction"].map((key, idx) => (
                            <View key={idx} style={styles.rightBodyCell}>
                                <Text style={styles.rightBodyText}>{salaryItem[key]}</Text>
                            </View>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </View>
    );

    return (
        <ScreenLayout
            isHeaderShown={true}
            headerTitle="Yearly Income"
            headerbackClick={() => props.navigation.goBack()}
            hamburgmenuVisable={false}
            showpowerButton={false}
            clickPowerbutton={() => setLogoutModal(true)}
        >
            <View style={styles.menuCard}>
                <View style={styles.container}>
                    {renderFixedHeader()}

                    <ScrollView
                        style={styles.scrollableContent}
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                    >
                        {renderScrollableContent()}
                    </ScrollView>
                </View>
            </View>
        </ScreenLayout>
    );
};

const getStyles = (colorTheme) => StyleSheet.create({
    container: {
        flex: 1,
        margin: 4,

    },
    headerContainer: {
        flexDirection: 'row',
        backgroundColor: colorTheme.headerColor,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    leftHeaderCell: {
        width: windowWidth * 0.35,
        padding: 10,
        borderRightWidth: 1,
        borderRightColor: colorTheme.whiteColor,
        borderBottomWidth: 1,
        borderBottomColor: colorTheme.shadeMedium,
        backgroundColor: colorTheme.headerColor,
        borderTopLeftRadius: 12,

    },
    rightHeaderContainer: {
        flex: 1,
    },
    rightHeaderCell: {
        width: windowWidth * 0.25,
        padding: 10,
        borderRightWidth: 1,
        borderRightColor: colorTheme.shadeMedium,
        borderBottomWidth: 1,
        borderBottomColor: colorTheme.shadeMedium,
        backgroundColor: colorTheme.headerColor,
         borderTopRightRadius: 12,
    },
    headerText: {
        fontFamily: FontFamily.bold,
        fontSize: FontSize.f13,
        color: colorTheme.whiteColor,
        textAlign: 'center',
    },
    scrollableContent: {
        flex: 1,
    },
    bodyContainer: {
        flexDirection: 'row',
    },
    leftBodyColumn: {
        width: windowWidth * 0.35,
        backgroundColor: colorTheme.headerColor,
    },
    leftBodyCell: {
        padding: 10,
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderRightColor: colorTheme.whiteColor,
        borderBottomColor: colorTheme.shadeMedium,
        backgroundColor: colorTheme.headerColor,
    },
    leftBodyText: {
        fontFamily: FontFamily.regular,
        fontSize: FontSize.f13,
        color: colorTheme.whiteColor,
    },
    rightBodyContainer: {
        flex: 1,
    },
    rightBodyColumn: {
        width: windowWidth * 0.25,
        borderRightWidth: 1,
        borderRightColor: colorTheme.shadeMedium,
        backgroundColor: colorTheme.whiteColor,
    },
    rightBodyCell: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: colorTheme.shadeMedium,
    },
    rightBodyText: {
        fontFamily: FontFamily.medium,
        fontSize: FontSize.f13,
        textAlign: 'center',
        color: colorTheme.black,
    },
    menuCard: {
        width: windowWidth,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        flex: 1,
        flexDirection: 'row',
        height: windowHeight,
        // justifyContent:'center',
        // alignItems:'flex-start',
        backgroundColor: colorTheme.whiteColor,
        //flexDirection:'column',
        // paddingTop:18,
        //paddingLeft:10,
        borderWidth: 1,
        borderColor: 1,


    },
});

export default YearlyIncome;