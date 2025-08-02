import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface AthleteUpdateState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: string;
  data: object;
}
const initialState: AthleteUpdateState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

export const UpdateAthleteByID = createAsyncThunk<any, { payload: any }>(
  'AthleteUpdate',
  async (payload, thunkAPI) => {
    return await Axios.post("Sports/UpdateAthleteByID", payload).catch(thunkAPI.rejectWithValue)
  }
);

export const AthleteUpdateSlice = createSlice({
  name: 'AthleteUpdate',
  initialState,
  reducers: {
    clearAthleteUpdateState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(UpdateAthleteByID.pending, (state: any) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(UpdateAthleteByID.fulfilled, (state: any, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
    }).addCase(UpdateAthleteByID.rejected, (state: any, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearAthleteUpdateState } = AthleteUpdateSlice.actions;
export default AthleteUpdateSlice.reducer;