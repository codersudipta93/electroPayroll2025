import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  leaveBalance: [],
  leaveApplicationHistory: [],
  leaveTypesdata:[],
  myApprovableList:[]
};

export const leaveReducer = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    setleaveBalance: (state, action) => {
      console.log(action)
      state.leaveBalance = action.payload
    },

    clearleaveBalance: (state) => {
      state.leaveBalance = []
    },

    setleaveApplicationHistory: (state, action) => {
      console.log(action)
      state.leaveApplicationHistory = action.payload
    },

    clearleaveApplicationHistory: (state) => {
      state.leaveApplicationHistory = []
    },

    //Leave types (apply leave screen)
    setLeaveTypesReducers: (state, action) => {
      console.log("action.payload :", action.payload)
      state.leaveTypesdata = action.payload
    },
    clearLeaveTypesReducers: (state) => {
      state.leaveTypesdata = []
    },

    //My approvable list (Approve leave screen )
    setApprovableListReducers: (state, action) => {
      state.myApprovableList = action.payload
    },
    clearApprovableListReducers: (state) => {
      state.myApprovableList = []
    },

  },
});

// Action creators are generated for each case reducer function
export const {
  setleaveBalance,
  clearleaveBalance,

  setleaveApplicationHistory,
  clearleaveApplicationHistory,

  // apply leave screen
  setLeaveTypesReducers,
  clearLeaveTypesReducers,

  // Approve leave screen
  setApprovableListReducers,
  clearApprovableListReducers,
  
} = leaveReducer.actions;

export default leaveReducer.reducer;
