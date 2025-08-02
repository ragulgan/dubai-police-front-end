import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface getTeamRequirementByIDInitialState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
  data: any;
}
const initialState: getTeamRequirementByIDInitialState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

export const getTeamRequirementByID = createAsyncThunk<any, { payload: any }>(
  'getTeamRequirementByID',
  async (payload, thunkAPI) => {
    return await Axios.post(`/Sports/GetTeamRequirementsByID`, payload).catch(thunkAPI.rejectWithValue)
  }
);

export const getTeamRequirementByIDSlice = createSlice({
  name: 'getTeamRequirementByID',
  initialState,
  reducers: {
   clearGetTeamRequirementByIDState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getTeamRequirementByID.pending, (state: any) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(getTeamRequirementByID.fulfilled, (state: any, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
    }).addCase(getTeamRequirementByID.rejected, (state: any, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearGetTeamRequirementByIDState } = getTeamRequirementByIDSlice.actions;
export default getTeamRequirementByIDSlice.reducer;