import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loantransactionList:[]
};

export const loanReducer = createSlice({
  name: 'loan',
  initialState,
  reducers: {

    setloantransactionData: (state, action) => {
      console.log(action)
      state.loantransactionList = action.payload
    },

    clearloantransactionData: (state) => {
      state.loantransactionList = []
    },


  },
});

// Action creators are generated for each case reducer function
export const {
  setloantransactionData,
  clearloantransactionData,

} = loanReducer.actions;

export default loanReducer.reducer;
