import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface getRaceCalendarIDState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
  data: any;
}
const initialState: getRaceCalendarIDState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

export const GetRaceCalendarByID = createAsyncThunk<any, { payload: any }>(
  'GetRaceCalendarByID',
  async (payload, thunkAPI) => {

    return await Axios.post(`/Sports/GetRaceCalendarByID`, payload).catch(thunkAPI.rejectWithValue)
  }
);

export const getRaceCalendarIDSlice = createSlice({
  name: 'GetRaceCalendarByID',
  initialState,
  reducers: {
    clearGetRaceCalendarByIDState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
      state.data = {};
    }
  },
  extraReducers: (builder) => {
    builder.addCase(GetRaceCalendarByID.pending, (state: any) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(GetRaceCalendarByID.fulfilled, (state: any, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
    }).addCase(GetRaceCalendarByID.rejected, (state: any, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearGetRaceCalendarByIDState } = getRaceCalendarIDSlice.actions;
export default getRaceCalendarIDSlice.reducer;