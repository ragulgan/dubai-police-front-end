import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';
import { uniqBy } from 'lodash';
import { setLocalStorage } from '@/utils/helper';

export interface StaffAndAthleteListState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
  data: any;
  totalRecords: number;
}
const initialState: StaffAndAthleteListState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {},
  totalRecords: 0
}

export const StaffAndAthleteDispatch = createAsyncThunk<any, { url: any; payload: any }>(
  'StaffAndAthleteList',
  async ({ url, payload }, thunkAPI) => {
    return await Axios.post(`/Sports${url}`, payload).catch(thunkAPI.rejectWithValue)
  }
);

export const StaffAndAthleteListSlice = createSlice({
  name: 'StaffAndAthleteList',
  initialState,
  reducers: {
    clearListState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
      state.totalRecords = 0;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(StaffAndAthleteDispatch.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(StaffAndAthleteDispatch.fulfilled, (state, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.totalRecords = action?.payload?.totalRecords
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode === 200 ? 200 : 500;
      state.error = false;

    }).addCase(StaffAndAthleteDispatch.rejected, (state, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearListState } = StaffAndAthleteListSlice.actions;
export default StaffAndAthleteListSlice.reducer;