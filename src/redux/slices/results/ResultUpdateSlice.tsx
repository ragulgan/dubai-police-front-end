import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface ResultsUpdateState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: string;
  data: object;
}
const initialState: ResultsUpdateState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

export const UpdateResultsByID = createAsyncThunk<any, { payload: any }>(
  'ResultsUpdate',
  async (payload, thunkAPI) => {
    return await Axios.post("Sports/UpdateResultsByID", payload).catch(thunkAPI.rejectWithValue)
  }
);

export const ResultsUpdateSlice = createSlice({
  name: 'ResultsUpdate',
  initialState,
  reducers: {
    clearResultsUpdateState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(UpdateResultsByID.pending, (state: any) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(UpdateResultsByID.fulfilled, (state: any, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
    }).addCase(UpdateResultsByID.rejected, (state: any, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearResultsUpdateState } = ResultsUpdateSlice.actions;
export default ResultsUpdateSlice.reducer;