import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface ResultsEditState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
  data: any;
}
const initialState: ResultsEditState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

export const editResults = createAsyncThunk<any, { payload: any }>(
  'ResultsEdit',
  async (payload, thunkAPI) => {
    return await Axios.post(`/Sports/GetResultByID`, payload).catch(thunkAPI.rejectWithValue)
  }
);

export const ResultsEditSlice = createSlice({
  name: 'ResultsEdit',
  initialState,
  reducers: {
    clearEditState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.data = '';
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(editResults.pending, (state: any) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(editResults.fulfilled, (state: any, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
    }).addCase(editResults.rejected, (state: any, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearEditState } = ResultsEditSlice.actions;
export default ResultsEditSlice.reducer;