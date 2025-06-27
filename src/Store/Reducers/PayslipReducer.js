import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    earningData: [],
    deductionData: []
};

export const payslipReducer = createSlice({
    name: 'payslip',
    initialState,
    reducers: {
        setearningData: (state, action) => {
            state.earningData = action.payload
        },

        setdeductionData: (state, action) => {
            state.deductionData = action.payload
        },

    },
});

// Action creators are generated for each case reducer function
export const {
    setearningData,
    setdeductionData
} = payslipReducer.actions;

export default payslipReducer.reducer;
