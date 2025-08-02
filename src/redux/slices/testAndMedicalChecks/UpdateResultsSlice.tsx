import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface updateTrainingPerformanceTestAndMedicalChecks {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: string;
  data: object;
}
const initialState: updateTrainingPerformanceTestAndMedicalChecks = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

export const UpdateTrainingPerformanceTestAndMedicalChecks = createAsyncThunk<any, { url: any; payload: any }>(
  'updateTrainingPerformanceTestAndMedicalChecks',
  async ({ url, payload }, thunkAPI) => {
    return await Axios.post(`/Sports${url}`, payload).catch(thunkAPI.rejectWithValue)
  }
);

export const updateTrainingPerformanceTestAndMedicalChecksSlice = createSlice({
  name: 'updateTrainingPerformanceTestAndMedicalChecks',
  initialState,
  reducers: {
    clearUpdateTrainingPerformanceTestAndMedicalChecks: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(UpdateTrainingPerformanceTestAndMedicalChecks.pending, (state: any) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(UpdateTrainingPerformanceTestAndMedicalChecks.fulfilled, (state: any, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
    }).addCase(UpdateTrainingPerformanceTestAndMedicalChecks.rejected, (state: any, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearUpdateTrainingPerformanceTestAndMedicalChecks } = updateTrainingPerformanceTestAndMedicalChecksSlice.actions;
export default updateTrainingPerformanceTestAndMedicalChecksSlice.reducer;