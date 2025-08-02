import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface ResultsAddState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
  data: any;
}
const initialState: ResultsAddState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

export const addResults = createAsyncThunk<any, { url: any; payload: any }>(
  'ResultsAdd',
  async ({ url, payload }, thunkAPI) => {
    return await Axios.post(`/Sports${url}`, payload).catch(thunkAPI.rejectWithValue)
  }
);

export const ResultsAddSlice = createSlice({
  name: 'ResultsAdd',
  initialState,
  reducers: {
    clearResultAddState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
      state.data = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(addResults.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(addResults.fulfilled, (state, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = action?.payload?.error;
    }).addCase(addResults.rejected, (state, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = action?.payload?.error;
    });
  }
});
export const { clearResultAddState } = ResultsAddSlice.actions;
export default ResultsAddSlice.reducer;