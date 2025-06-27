import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    assetsList:[]
};

export const assetsReducer = createSlice({
  name: 'assets',
  initialState,
  reducers: {

    setAssetList: (state, action) => {
      console.log(action)
      state.assetsList = action.payload
    },

    clearAssetList: (state) => {
      state.assetsList = []
    },


  },
});

// Action creators are generated for each case reducer function
export const {
  setAssetList,
  clearAssetList,
} = assetsReducer.actions;

export default assetsReducer.reducer;
