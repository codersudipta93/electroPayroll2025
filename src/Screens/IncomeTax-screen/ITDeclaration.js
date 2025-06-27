import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../Constants/Theme/Theme';
import { FontFamily, FontSize } from '../../Constants/Fonts';
import { Loader, ScreenLayout } from '../../Components';
import Snackbar from 'react-native-snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { postWithToken } from '../../Service/service';
import ActionSheet from "react-native-actions-sheet";

const DeductionItem = ({ item, control, errors, path, colorTheme, toggleExpand, watch, setValue, isRoot, isSubRoot }) => {
  const subcategories = Array.isArray(item.deduction_subcategory) ? item.deduction_subcategory : [];
  const hasSubcategories = subcategories.length > 0;

  const actualName = `${path}.ActualAmount`;
  const declaredName = `${path}.DeclaredAmount`;

  const actualValue = watch(actualName);
  const declaredValue = watch(declaredName);


  useEffect(() => {
    if (!hasSubcategories) return;

    const actualPaths = subcategories.map((_, idx) => `${path}.deduction_subcategory.${idx}.ActualAmount`);
    const declaredPaths = subcategories.map((_, idx) => `${path}.deduction_subcategory.${idx}.DeclaredAmount`);

    const actualValues = watch(actualPaths);
    const declaredValues = watch(declaredPaths);

    const totalActual = actualValues.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    const totalDeclared = declaredValues.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

    setValue(actualName, totalActual.toFixed(2));
    setValue(declaredName, totalDeclared.toFixed(2));
  }, [watch(subcategories.flatMap((_, idx) => [
    `${path}.deduction_subcategory.${idx}.ActualAmount`,
    `${path}.deduction_subcategory.${idx}.DeclaredAmount`
  ]))]);

  return (
    <View style={{ ...styles.deductionContainer, borderColor: colorTheme.headerColor }}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={{ ...styles.headerText, color: colorTheme.headerColor }}>{item.deduction_category}</Text>
          {!!item.ITRule && <Text style={{ ...styles.itRuleText, color: colorTheme.headerColor }}>{item.ITRule}</Text>}
        </View>
        {item.deduction_subcategory != "" && (
          <Icon
            onPress={() => toggleExpand(path)}
            name={item?.enlarge_status ? 'chevron-up-circle-sharp' : 'chevron-down-circle-sharp'}
            size={32}
            color={isRoot ? colorTheme.headerColor : colorTheme.lightBlue}
          />
        )}
      </View>

      {['ActualAmount', 'DeclaredAmount'].map((field, idx) => {
        const name = `${path}.${field}`;
        return (
          <View key={field} style={styles.amountInputGroup}>
            <Text style={styles.amountLabel}>{field.replace('Amount', ' Amount')}</Text>
            <Controller
              control={control}
              name={name}
              defaultValue={item[field] || ''}
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  style={{
                    ...styles.inputContainer,
                    borderColor: errors?.[name] ? 'red' : colorTheme.shadeMedium,
                    backgroundColor: hasSubcategories ? colorTheme.shadeLight : colorTheme.whiteColor,
                  }}
                >
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder={'0.00'}
                    editable={!hasSubcategories}
                  />
                </View>
              )}
            />
            {!!errors?.[name] && (
              <Text style={styles.errorText}>{errors[name].message}</Text>
            )}
          </View>
        );
      })}

      {!!item?.enlarge_status && subcategories.map((sub, idx) => (
        <DeductionItem
          key={`${path}.deduction_subcategory.${idx}`}
          item={sub}
          control={control}
          errors={errors}
          path={`${path}.deduction_subcategory.${idx}`}
          colorTheme={colorTheme}
          toggleExpand={toggleExpand}
          watch={watch}
          setValue={setValue}
          isRoot={false}
          isSubRoot={hasSubcategories ? true : false}
        />
      ))}
    </View>
  );
};

const ITDeductionForm = props => {
  const dispatch = useDispatch();
  const { colorTheme } = useTheme();
  const { employeeApiUrl, employeeDetails } = useSelector(state => state.common);
  const [loader, setloader] = useState([]);
  const yearActionSheet = useRef(null);
  const considerActionSheet = useRef(null);

  const [sampleData, setSampleData] = useState([]);
  const [years, setYears] = React.useState('');
  const [considerArr, SetConsiders] = React.useState(['Decleared', 'Actual']);

  const [selectedYear, setYear] = React.useState('');
  const [selectedConsider, setselectedConsider] = React.useState('Decleared')

  const { control, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    defaultValues: { deductions: [] },
    mode: 'onBlur',
  });

  useEffect(() => {
    let today = new Date();
    let currentYear = today.getFullYear();
    let yearArr = [];
    yearArr.push(currentYear);

    for (let i = 0; i < 4; i++) {
      yearArr.push(yearArr[i] - 1)
    }

    console.log(yearArr)
    //Set years arr
    setYears(yearArr);
    setYear(currentYear)
    getITDeclarationData(currentYear, selectedConsider);
  }, [])


  setYearValueSelection = ((y, considerVal) => {
    setYear(y)
    yearActionSheet.current?.hide();
    setselectedConsider(considerVal);     
    setTimeout(() => {
      getITDeclarationData(y, considerVal);
    }, 1000)
  })


  const showMsg = msg => Snackbar.show({ text: msg, duration: Snackbar.LENGTH_SHORT });

  const getITDeclarationData = (fetchYear, considerVal) => {
    setloader(true)
    const paramData = { EmployeeId: employeeDetails?.EmployeeId, year: fetchYear };
    postWithToken(employeeApiUrl, 'ITDeclarationInfo', paramData)
      .then(resp => {
        console.log(resp);
        if (resp.Status) {
          setSampleData(resp.Data);
          reset({ deductions: resp.Data });
          setloader(false)
        } else {
          showMsg(resp.msg);
          setloader(false);
        }
      })
      .catch(err => {
        console.error('Error fetching IT Declaration:', err);
        setloader(false);
      });
  };

  const toggleExpand = path => {
    const deepCopy = obj => Array.isArray(obj) ? obj.map(deepCopy) : (obj && typeof obj === 'object') ? Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, deepCopy(v)])) : obj;
    const newData = deepCopy(sampleData);
    const pathArray = path.replace(/^deductions\./, '').split('.').map(p => isNaN(p) ? p : Number(p));
    let current = newData;
    for (let i = 0; i < pathArray.length - 1; i++) current = current[pathArray[i]];
    current[pathArray.at(-1)].enlarge_status = !current[pathArray.at(-1)].enlarge_status;
    setSampleData(newData);
  };

  const onSubmit = data => {
    console.log('Form Data:', data);
    setloader(true)
    const paramData = { Data: data };
    postWithToken(employeeApiUrl, 'ITDeclarationUpdate', paramData)
      .then(resp => {
        if (resp.Status) {
          showMsg('Form submitted!');
          setloader(false)
        } else {
          setloader(false)
          showMsg(resp.msg);
        }
      })
      .catch(err => {
        console.error('Error fetching IT Declaration:', err)
        setloader(false)
      });
  };


  const renderYearItem = ({ item }) => (
    <TouchableOpacity
      style={{ marginTop: 12, borderBottomColor: '#ebf0f9', borderBottomWidth: 1 }}
      onPress={() => setYearValueSelection(item, selectedConsider)}
    >
      <Text style={{ fontSize: 14, marginBottom: 12, fontWeight: selectedYear == item ? '800' : '400' }}>{item}</Text>
    </TouchableOpacity>
  );

  const renderConsidereItem = ({ item }) => (
    <TouchableOpacity
      style={{ marginTop: 12, borderBottomColor: '#ebf0f9', borderBottomWidth: 1 }}
      onPress={() => setYearValueSelection(selectedYear, item)}
    >
      <Text style={{ fontSize: 14, marginBottom: 12, fontWeight: selectedYear == item ? '800' : '400' }}>{item}</Text>
    </TouchableOpacity>
  );


  return (
    <ScreenLayout
      isHeaderShown
      isShownHeaderLogo={false}
      headerTitle="IT Declaration"
      headerbackClick={() => props.navigation.goBack()}
    >
      <ScrollView style={{ backgroundColor: colorTheme.shadeLight, borderRadius: 12 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        <View style={styles.menuWrapper}>


          <TouchableOpacity
            style={[styles.toDateMain, { width: "38%" }]}
            onPress={() => yearActionSheet.current?.show()}
          >
            <Text style={{ fontSize: 13 }}>Year</Text>

            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
              <Text style={[styles.toDateLabel, { marginLeft: 12, fontSize: FontSize.f14, fontFamily: FontFamily.bold }]} >{selectedYear ? selectedYear : 'YYYY'} </Text>
              <Icon name="calendar" size={18} color={colorTheme.blackColor} />
            </View>

          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toDateMain, { marginLeft: 8, width: '58%' }]}
            onPress={() => considerActionSheet.current?.show()}>
            <Text style={{ fontSize: 13 }}>Consider</Text>
            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
              <Text style={[styles.toDateLabel, { marginLeft: 12,  fontFamily: FontFamily.bold }]}> {selectedConsider ? selectedConsider : 'Select'} </Text>
              {/* <Icon name="calendar" size={18} color={colorTheme.blackColor} /> */}
            </View>
          </TouchableOpacity>

        </View>

        <View style={{ marginBottom: 80 }}>
          <Controller
            control={control}
            name="deductions"
            render={() => (
              <>
                {sampleData.map((item, index) => (
                  <DeductionItem
                    key={`deductions.${index}`}
                    item={item}
                    control={control}
                    errors={errors}
                    path={`deductions.${index}`}
                    colorTheme={colorTheme}
                    toggleExpand={toggleExpand}
                    watch={watch}
                    setValue={setValue}
                    isRoot={true}
                  />
                ))}
              </>
            )}
          />
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.submitBtnText}>Submit</Text>
      </TouchableOpacity>

      <ActionSheet ref={considerActionSheet} containerStyle={styles.actionsheetStyle}>
        <View style={{ paddingHorizontal: 12 }}>
          <Text style={styles.modalText}>Select consider type</Text>
          <FlatList
            data={considerArr}
            renderItem={renderConsidereItem}
            keyExtractor={(item, index) => index}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ActionSheet>


      <ActionSheet ref={yearActionSheet} containerStyle={styles.actionsheetStyle}>
        <View style={{ paddingHorizontal: 12 }}>
          <Text style={styles.modalText}>Select Year</Text>
          <FlatList
            data={years}
            renderItem={renderYearItem}
            keyExtractor={(item, index) => index}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ActionSheet>

      <Loader visible={loader} />
    </ScreenLayout>
  );
};

export default ITDeductionForm;

const styles = StyleSheet.create({
  deductionContainer: {
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: '#fff',
    marginVertical: 8,
    marginHorizontal: 8,
    padding: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  headerText: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
  },
  itRuleText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    marginTop: 4,
  },
  amountInputGroup: {
    marginTop: 12,
  },
  amountLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    marginBottom: 8,
  },
  inputContainer: {
    width: '100%',
    borderWidth: 0.4,
    borderRadius: 5,
  },
  textInput: {
    height: 45,
    color: 'black',
    paddingLeft: 10,
    fontFamily: FontFamily.medium,
    fontSize: 13,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  submitBtn: {
    marginTop: 24,
    backgroundColor: '#440067',
    paddingVertical: 14,
    borderRadius: 8,
    alignSelf: 'center',
    position: 'absolute',
    width: '90%',
    bottom: 4,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: FontFamily.medium,
    textAlign: 'center',
    toDateLabel: { marginLeft: 4, color: "#000x" },
  },
  menuWrapper: { alignItems: 'center', justifyContent: 'center', flexDirection: 'row', backgroundColor: "#fff", borderWidth: 1, borderColor: "#bdbdbd", padding: 6, width: '90%', marginTop: 8, marginBottom: 10, borderRadius: 6, elevation: 6,alignSelf:'center' },
  modalText: {
    marginBottom: 6,
    textAlign: "center",
    fontWeight: '800',
    marginTop: 12,
    color: '#000'
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
  },
  toDateMain: { borderRadius: 4, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', backgroundColor: "#dbe3f0", paddingHorizontal: 12, width: '48%', paddingVertical: 4 },

});
