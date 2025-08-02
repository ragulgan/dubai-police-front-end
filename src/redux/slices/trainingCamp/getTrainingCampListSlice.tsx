import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface getTraningCampListSlice {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
  data: any;
  totalRecords: number;
}
const initialState: getTraningCampListSlice = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {},
  totalRecords: 0,
}

export const getTraningCampListAPI = createAsyncThunk<any, { url: string; payload: any }>(
  'getTraningCampsList',
  async ({ url, payload }, thunkAPI) => {
    return await Axios.post(`/Sports${url}`, payload).catch(thunkAPI.rejectWithValue)
  }
);

export const getTraningCampsListSlice = createSlice({
  name: 'getTraningCampsList',
  initialState,
  reducers: {
    clearGetTraningCampsListState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
      state.totalRecords = 0;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getTraningCampListAPI.pending, (state: any) => {
      state.loading = true;
      state.message = '';
      state.error = false;
      state.totalRecords = 0;
    }).addCase(getTraningCampListAPI.fulfilled, (state: any, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.totalRecords = action?.payload?.totalRecords;
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode === 200 ? 200 : 500;
      state.error = false;
    }).addCase(getTraningCampListAPI.rejected, (state: any, action: any) => {
      state.loading = false;
      state.totalRecords = 0;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearGetTraningCampsListState } = getTraningCampsListSlice.actions;
export default getTraningCampsListSlice.reducer;