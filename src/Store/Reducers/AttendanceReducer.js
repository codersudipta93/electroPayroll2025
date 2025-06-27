import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  attendenceData:[],
  todayAttandanceReport:[]
};

export const attendanceReducer = createSlice({
  name: 'attendence',
  initialState,
  reducers: {
    seAttendance: (state, action) => {
      state.attendenceData = action.payload
    },

    clearAttendance: (state) => {
      state.attendenceData = []
    },

    setTodaysAttendanceReport: (state, action) => {
      state.todayAttandanceReport = action.payload
    },

  },
});

// Action creators are generated for each case reducer function
export const {
  seAttendance,
  clearAttendance,
  setTodaysAttendanceReport
} = attendanceReducer.actions;

export default attendanceReducer.reducer;
