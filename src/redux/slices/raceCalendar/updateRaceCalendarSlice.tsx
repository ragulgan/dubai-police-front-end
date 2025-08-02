import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface RaceCalendarUpdateState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
  data: any;
}
const initialState: RaceCalendarUpdateState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

export const updateRaceCalendar = createAsyncThunk<any, { payload: any }>(
  'updateRaceCalendar',
  async (payload, thunkAPI) => {
    return await Axios.post(`/Sports/UpdateRaceCalendarByID`, payload).catch(thunkAPI.rejectWithValue)
  }
);

export const updateRaceCalendarSlice = createSlice({
  name: 'updateRaceCalendarSlice',
  initialState,
  reducers: {
    clearUpdateRaceCalendarState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(updateRaceCalendar.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(updateRaceCalendar.fulfilled, (state, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
    }).addCase(updateRaceCalendar.rejected, (state, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearUpdateRaceCalendarState } = updateRaceCalendarSlice.actions;
export default updateRaceCalendarSlice.reducer;