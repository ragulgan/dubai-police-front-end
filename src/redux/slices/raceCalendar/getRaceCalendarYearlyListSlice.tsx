import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface getRaceCalendarYearlyListState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
  data: any;
  totalRecords: number;
}
const initialState: getRaceCalendarYearlyListState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {},
  totalRecords: 0,
}

export const getRaceYearlyCalendarAPI = createAsyncThunk<any, any>(
  'getRaceYearlyCalendarListSlice',
  async (url,thunkAPI) => {
console.log({url});

    // return await Axios.get(`https://qa-dpsm.isportz.co/api/YearView/RaceCalendar/2025`).catch(thunkAPI.rejectWithValue)
    return await Axios.get(`${url}`).catch(thunkAPI.rejectWithValue)
  }
);

export const getRaceYearlyCalendarListSlice = createSlice({
  name: 'getRaceYearlyCalendarListSlice',
  initialState,
  reducers: {
    clearGetRaceYearlyCalendarListState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
      state.totalRecords = 0;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getRaceYearlyCalendarAPI.pending, (state: any) => {
      state.loading = true;
      state.message = '';
      state.error = false;
      state.totalRecords = 0;
    }).addCase(getRaceYearlyCalendarAPI.fulfilled, (state: any, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.totalRecords = action?.payload?.totalRecords;
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode === 200 ? 200 : 500;
      state.error = false;
    }).addCase(getRaceYearlyCalendarAPI.rejected, (state: any, action: any) => {
      state.loading = false;
      state.totalRecords = 0;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearGetRaceYearlyCalendarListState } = getRaceYearlyCalendarListSlice.actions;
export default getRaceYearlyCalendarListSlice.reducer;