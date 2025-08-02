import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface StaffUpdateState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: string;
  data: object;
}
const initialState: StaffUpdateState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

export const UpdateStaff = createAsyncThunk<any, { payload: any }>(
  'StaffUpdate',
  async (payload, thunkAPI) => {
    return await Axios.post("Sports/UpdateStaffByID", payload).catch(thunkAPI.rejectWithValue)
  }
);

export const StaffUpdateSlice = createSlice({
  name: 'StaffUpdate',
  initialState,
  reducers: {
    clearUpdateState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(UpdateStaff.pending, (state: any) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(UpdateStaff.fulfilled, (state: any, action: any) => {
      state.loading = false;
      state.status = action?.payload?.responseCode === 200 ? 'succeeded' : 'failed';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode === 200 ? 200 : 500;
      state.error = false;
    }).addCase(UpdateStaff.rejected, (state: any, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearUpdateState } = StaffUpdateSlice.actions;
export default StaffUpdateSlice.reducer;