import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

interface RaceCalendarState {
  data: {}
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: '',
}

const initialState: RaceCalendarState = {
  data: {},
  loading: false,
  message: '',
  error: false,
  status: 'idle',
  code: '',
};

export const deleteRaceCalendarById = createAsyncThunk('RaceCalendarDelete/delete', async (data: any, thunkAPI) => {
  return await Axios.post("Sports/DeleteRaceCalendarByID", data).catch(thunkAPI.rejectWithValue)
}
);

export const RaceCalendarDeleteSlice = createSlice({
  name: 'RaceCalendarDelete',
  initialState,
  reducers: {
    clearDeleteState: (state) => {
      state.data = [];
      state.loading = false;
      state.message = '';
      state.error = false;
      state.status = 'idle';
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(deleteRaceCalendarById.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    })
      .addCase(deleteRaceCalendarById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = action?.payload?.data
        state.message = action?.payload?.description;
        state.code = action?.payload?.responseCode;
        state.error = false;
      })
      .addCase(deleteRaceCalendarById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.code = action?.payload?.responseCode;
        state.message = action?.payload?.description || 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearDeleteState } = RaceCalendarDeleteSlice.actions;
export default RaceCalendarDeleteSlice.reducer;