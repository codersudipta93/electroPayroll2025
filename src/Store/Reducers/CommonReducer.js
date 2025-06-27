import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userDetails: {},
  token: '',
  companyDetails: {},
  employeeDetails: {},
  employeeApiUrl: "",
  //companyApiUrl:'http://45.249.111.51/payrollmobile/api/PayrollApi/', // old url 25th sep
  companyApiUrl: 'https://rootapi.electropayroll.in/api/PayrollApi/',
  currentAppVersion:"0.0.15",
  // PayrollApiUrl

  isDarkMode: false,
  count: 0,
  isLogin: false,
  fcmPlayerId: '',

  //Navigation state
  isStackHeaderVisible: false,

  employeeBasicDetails: [],
  employeeStatutoryDetails: [],
  employeePersonalDetails: [],
};

export const commonReducer = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setIsDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    resetToken: state => {
      state.token = '';
    },
    resetCommonStore: state => {
      state.token = '';
    },
    increment: (state, action) => {
      state.count = state.count + action.payload;
    },
    decrement: (state, action) => {
      state.count = state.count - action.payload;
    },
    setLogin: (state, action) => {
      state.isLogin = action.payload
    },
    setFcmPlayerID: (state, action) => { 
      console.log("action.payload : ", action.payload);
      state.fcmPlayerId = action.payload
    },



    setCompanyDetails: (state, action) => {
      // console.log("action.payload.ApiUrl : ", action.payload[0].ApiUrl);
      state.companyDetails = action.payload[0]
      state.employeeApiUrl = action.payload[0].ApiUrl
    },
    setEmployeeDetails: (state, action) => {
      state.employeeDetails = action.payload,
        state.token = action.payload.Token
    },

    clearEmpAndCompanyDetails: (state) => {
      state.companyDetails = {},
        state.employeeApiUrl = {},
        state.employeeDetails = {},

        state.token = {}
    },


    // ============ 30-09-22 ==========================

    setEmpBasicDetails: (state, action) => {
      state.employeeBasicDetails = action.payload
    },

    clearEmpBasicDetails: (state) => {
      state.employeeBasicDetails = []
    },


    setEmployeeStatutoryDetails: (state, action) => {
      state.employeeStatutoryDetails = action.payload
    },

    clearEmployeeStatutoryDetails: (state) => {
      state.employeeStatutoryDetails = []
    },

    setEmployeePersonalDetails: (state, action) => {
      state.employeePersonalDetails = action.payload
    },

    clearEmployeePersonalDetails: (state) => {
      state.employeePersonalDetails = []
    },

   // ==================================================

    /* === Fetch and store from Localstorage === */
    localstorage_CompanyDetailsAdd: (state, action) => {
      state.companyDetails = action.payload
    },
    localstorage_EmployeeDetailsAdd: (state, action) => {
      state.employeeDetails = action.payload
    },
    localstorage_EmployeeApiUrlAdd: (state, action) => {
      state.employeeApiUrl = action.payload
    },
    localstorage_TokenAdd: (state, action) => {
      state.token = action.payload
    },

    //Navigation State
    setIsStackHeaderVisible: (state, action) => {
      state.isStackHeaderVisible = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setIsDarkMode,
  setToken,
  resetToken,
  resetCommonStore,
  increment,
  decrement,
  setFcmPlayerID,

  setCompanyDetails,
  setEmployeeDetails,

  localstorage_CompanyDetailsAdd,
  localstorage_EmployeeApiUrlAdd,
  localstorage_EmployeeDetailsAdd,
  localstorage_TokenAdd,
  clearEmpAndCompanyDetails,

  setEmpBasicDetails,
  clearEmpBasicDetails,

  setEmployeeStatutoryDetails,
  clearEmployeeStatutoryDetails,

  setEmployeePersonalDetails,
  clearEmployeePersonalDetails,

  //Navigation State
  setIsStackHeaderVisible
} = commonReducer.actions;

export default commonReducer.reducer;
