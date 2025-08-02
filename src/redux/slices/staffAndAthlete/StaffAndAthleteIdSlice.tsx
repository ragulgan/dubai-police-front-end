import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface StaffAndAthleteIdState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
  data: any;
}
const initialState: StaffAndAthleteIdState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

export const StaffAndAthleteId = createAsyncThunk<any, { payload: any }>(
  'StaffAndAthleteId',
  async (payload, thunkAPI) => {
    return await Axios.post(`/Login/GetEmployeeInfoByID`, payload).catch(thunkAPI.rejectWithValue)
  }
);

export const StaffAndAthleteIdSlice = createSlice({
  name: 'StaffAndAthleteId',
  initialState,
  reducers: {
    clearStaffAndAthleteIdState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
      state.data = {}
    }
  },
  extraReducers: (builder) => {
    builder.addCase(StaffAndAthleteId.pending, (state: any) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(StaffAndAthleteId.fulfilled, (state: any, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
    }).addCase(StaffAndAthleteId.rejected, (state: any, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearStaffAndAthleteIdState } = StaffAndAthleteIdSlice.actions;
export default StaffAndAthleteIdSlice.reducer;