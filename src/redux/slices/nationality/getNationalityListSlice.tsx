import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface getNationalityListInitialState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
  data: any;
}
const initialState: getNationalityListInitialState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

export const getNationalityListAPI = createAsyncThunk<any>(
  'getNationalityList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Axios.post(`/Sports/GetCountryList`);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getNationalityListSlice = createSlice({
  name: 'getNationalityList',
  initialState,
  reducers: {
    clearGetNationalityListState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getNationalityListAPI.pending, (state: any) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(getNationalityListAPI.fulfilled, (state: any, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
    }).addCase(getNationalityListAPI.rejected, (state: any, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearGetNationalityListState } = getNationalityListSlice.actions;
export default getNationalityListSlice.reducer;