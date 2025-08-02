import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface updateTrainingResults {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: string;
  data: object;
}
const initialState: updateTrainingResults = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

export const UpdateTrainingResultsByID = createAsyncThunk<any, { payload: any }>(
  'updateTrainingResults',
  async (payload, thunkAPI) => {
    return await Axios.post("Sports/UpdateTrainingResultsByID", payload).catch(thunkAPI.rejectWithValue)
  }
);

export const updateTrainingResultsSlice = createSlice({
  name: 'updateTrainingResults',
  initialState,
  reducers: {
    clearUpdateTrainingResults: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(UpdateTrainingResultsByID.pending, (state: any) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(UpdateTrainingResultsByID.fulfilled, (state: any, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
    }).addCase(UpdateTrainingResultsByID.rejected, (state: any, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearUpdateTrainingResults } = updateTrainingResultsSlice.actions;
export default updateTrainingResultsSlice.reducer;