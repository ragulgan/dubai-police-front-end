import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface updateTrainingPerformanceResults {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: string;
  data: object;
}
const initialState: updateTrainingPerformanceResults = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

export const UpdateTrainingPerformanceResults = createAsyncThunk<any, { url: any; payload: any }>(
  'updateTrainingPerformanceResults',
  async ({ url, payload }, thunkAPI) => {
    return await Axios.post(`/Sports${url}`, payload).catch(thunkAPI.rejectWithValue)
  }
);

export const updateTrainingPerformanceResultsSlice = createSlice({
  name: 'updateTrainingPerformanceResults',
  initialState,
  reducers: {
    clearUpdateTrainingPerformanceResults: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(UpdateTrainingPerformanceResults.pending, (state: any) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(UpdateTrainingPerformanceResults.fulfilled, (state: any, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
    }).addCase(UpdateTrainingPerformanceResults.rejected, (state: any, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearUpdateTrainingPerformanceResults } = updateTrainingPerformanceResultsSlice.actions;
export default updateTrainingPerformanceResultsSlice.reducer;