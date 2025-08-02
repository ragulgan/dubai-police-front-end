import { createSlice } from "@reduxjs/toolkit";

// Define the type for the slice state
interface AppState {
  isRTL: boolean;
  isUpdated: boolean;
  allSportMenu: boolean;
  isSettingUpdated: boolean;
  isDiscard: boolean;
}

// Initial state with type annotation
const initialState: AppState = {
  isRTL: false,
  isUpdated: false,
  allSportMenu: false,
  isSettingUpdated: false,
  isDiscard: false,
};

// Create the slice
const appSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleLanguage: (state) => {
      state.isRTL = !state.isRTL;
    },
    isUpdatedFunc: (state, action) => {
      state.isUpdated = action.payload; // Accepts a value and sets `isUpdated` to it
    },
    handleSubMenu: (state, action) => {
      state.allSportMenu = action.payload;
    },
    handleAdminSetting: (state, action) => {
      state.isSettingUpdated = action.payload;
    },
    handleDiscard: (state, action) => {
      state.isDiscard = action.payload;
    },
  },
});

// Export actions and reducer
export const { toggleLanguage, isUpdatedFunc, handleSubMenu,handleAdminSetting,handleDiscard } = appSlice.actions;
export default appSlice.reducer;
