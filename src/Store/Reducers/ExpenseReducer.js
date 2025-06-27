import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  expenseList:[]
};

export const expenseReducer = createSlice({
  name: 'expense',
  initialState,
  reducers: {

    setExpenseList: (state, action) => {
      console.log(action)
      state.expenseList = action.payload
    },

    clearExpenseList: (state) => {
      state.expenseList = []
    },


  },
});

// Action creators are generated for each case reducer function
export const {
  setExpenseList,
  clearExpenseList,

} = expenseReducer.actions;

export default expenseReducer.reducer;
