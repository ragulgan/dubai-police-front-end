import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface getRaceCalendarListState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
  data: any;
  totalRecords: number;
}
const initialState: getRaceCalendarListState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {},
  totalRecords: 0,
}

export const getRaceCalendarAPI = createAsyncThunk<any, any>(
  'getRaceCalendarList',
  async (payload, thunkAPI) => {

    return await Axios.post(`/Sports/GetRaceCalendarOverallList`, payload).catch(thunkAPI.rejectWithValue)
  }
);

export const getRaceCalendarListSlice = createSlice({
  name: 'getRaceCalendarList',
  initialState,
  reducers: {
    clearGetRaceCalendarListState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
      state.totalRecords = 0;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getRaceCalendarAPI.pending, (state: any) => {
      state.loading = true;
      state.message = '';
      state.error = false;
      state.totalRecords = 0;
    }).addCase(getRaceCalendarAPI.fulfilled, (state: any, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.totalRecords = action?.payload?.totalRecords;
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode === 200 ? 200 : 500;
      state.error = false;
    }).addCase(getRaceCalendarAPI.rejected, (state: any, action: any) => {
      state.loading = false;
      state.totalRecords = 0;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearGetRaceCalendarListState } = getRaceCalendarListSlice.actions;
export default getRaceCalendarListSlice.reducer;