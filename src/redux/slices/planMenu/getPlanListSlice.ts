import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface getPlanListInitialState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
  data: any;
}
const initialState: getPlanListInitialState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

export const getPlanListAPI = createAsyncThunk<any, any>(
  'getPlanList',
  async (payload, thunkAPI) => {
    return await Axios.post(`/Sports/GetPlanList`, payload).catch(thunkAPI.rejectWithValue)
  }
);

export const getPlanListSlice = createSlice({
  name: 'getPlanList',
  initialState,
  reducers: {
    clearGetPlanListState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getPlanListAPI.pending, (state: any) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(getPlanListAPI.fulfilled, (state: any, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
    }).addCase(getPlanListAPI.rejected, (state: any, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearGetPlanListState } = getPlanListSlice.actions;
export default getPlanListSlice.reducer;