import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface AthleteEditState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
  data: any;
}
const initialState: AthleteEditState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

export const editAthlete = createAsyncThunk<any, { payload: any }>(
  'AthleteEdit',
  async (payload, thunkAPI) => {
    return await Axios.post(`/Sports/GetAthleteByID`, payload).catch(thunkAPI.rejectWithValue)
  }
);

export const AthleteEditSlice = createSlice({
  name: 'AthleteEdit',
  initialState,
  reducers: {
    clearEditAtheleteState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
      state.data= ''
    }
  },
  extraReducers: (builder) => {
    builder.addCase(editAthlete.pending, (state: any) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(editAthlete.fulfilled, (state: any, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
    }).addCase(editAthlete.rejected, (state: any, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearEditAtheleteState } = AthleteEditSlice.actions;
export default AthleteEditSlice.reducer;