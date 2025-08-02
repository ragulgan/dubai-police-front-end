import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface getProgramIDState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
  data: any;
}
const initialState: getProgramIDState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

export const GetProgramByID = createAsyncThunk<any, { payload: any }>(
  'GetProgramByID',
  async (payload, thunkAPI) => {

    return await Axios.post(`/Sports/GetProgramsByID`, payload).catch(thunkAPI.rejectWithValue)
  }
);

export const getProgramIDSlice = createSlice({
  name: 'GetProgramByID',
  initialState,
  reducers: {
    clearGetProgramByIDState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
      state.data = {};
    }
  },
  extraReducers: (builder) => {
    builder.addCase(GetProgramByID.pending, (state: any) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(GetProgramByID.fulfilled, (state: any, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
    }).addCase(GetProgramByID.rejected, (state: any, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearGetProgramByIDState } = getProgramIDSlice.actions;
export default getProgramIDSlice.reducer;