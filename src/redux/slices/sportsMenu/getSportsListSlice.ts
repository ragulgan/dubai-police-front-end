import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface getSportsListInitialState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
  data: any;
}
const initialState: getSportsListInitialState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

export const getSportsListAPI = createAsyncThunk<any, any>(
  'getSportsList',
  async (payload, thunkAPI) => {

    return await Axios.post(`/Sports/GetSportsList`, payload).catch(thunkAPI.rejectWithValue)
  }
);

export const getSportsListSlice = createSlice({
  name: 'getSportsList',
  initialState,
  reducers: {
    clearGetSportsListState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getSportsListAPI.pending, (state: any) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(getSportsListAPI.fulfilled, (state: any, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
    }).addCase(getSportsListAPI.rejected, (state: any, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearGetSportsListState } = getSportsListSlice.actions;
export default getSportsListSlice.reducer;