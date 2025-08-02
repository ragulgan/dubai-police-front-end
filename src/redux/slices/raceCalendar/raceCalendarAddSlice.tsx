import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface RaceCalendarAddState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
  data: any;
}
const initialState: RaceCalendarAddState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

export const addRaceCalendar = createAsyncThunk<any, { payload: any }>(
  'RaceCalendarAdd',
  async (payload, thunkAPI) => {
    return await Axios.post(`/Sports/InsertRaceCalendar`, payload).catch(thunkAPI.rejectWithValue)
  }
);

export const raceCalendarAddSlice = createSlice({
  name: 'RaceCalendarAddSlice',
  initialState,
  reducers: {
    clearAddRaceCalendarState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(addRaceCalendar.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(addRaceCalendar.fulfilled, (state, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
    }).addCase(addRaceCalendar.rejected, (state, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearAddRaceCalendarState } = raceCalendarAddSlice.actions;
export default raceCalendarAddSlice.reducer;