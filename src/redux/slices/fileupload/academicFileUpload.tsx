import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/axiosFileInstance';

export interface MerchantAddState {
  data: any;
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
}
const initialState: MerchantAddState = {
  data: {},
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: ''
}

export const academicFileUpload = createAsyncThunk<any, { url: any; payload: any }>(
  'academicFile',
  async ({ url, payload }, thunkAPI) => {
    return await Axios.post(`/Sports${url}`, payload).catch(thunkAPI.rejectWithValue)
  }
);

export const academicFileUploadSlice = createSlice({
  name: 'academicFile',
  initialState,
  reducers: {
    clearAcademicFileUploadState: (state) => {
      state.data = {};
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(academicFileUpload.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
      state.code = '';
    }).addCase(academicFileUpload.fulfilled, (state, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.code = action?.payload?.responseCode;
      state.data = action?.payload?.data;
      state.message = action?.payload?.description;
      state.error = false;
    }).addCase(academicFileUpload.rejected, (state, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearAcademicFileUploadState } = academicFileUploadSlice.actions;
export default academicFileUploadSlice.reducer;