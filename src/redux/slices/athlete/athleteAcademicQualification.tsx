import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface AcademicQualificationAddState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
  data: any;
}
const initialState: AcademicQualificationAddState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

export const addAcademicQualification = createAsyncThunk<any, { url: any; payload: any }>(
  'AcademicQualificationAdd',
  async ({ url, payload }, thunkAPI) => {
    return await Axios.post(`/Sports${url}`, payload).catch(thunkAPI.rejectWithValue)
  }
);

export const AcademicQualificationAddSlice = createSlice({
  name: 'AcademicQualificationAdd',
  initialState,
  reducers: {
    clearAddAcademicState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(addAcademicQualification.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(addAcademicQualification.fulfilled, (state, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
    }).addCase(addAcademicQualification.rejected, (state, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearAddAcademicState } = AcademicQualificationAddSlice.actions;
export default AcademicQualificationAddSlice.reducer;