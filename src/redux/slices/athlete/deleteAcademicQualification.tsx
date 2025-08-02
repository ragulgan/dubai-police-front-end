import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface AcademicQualificationDeleteState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
  data: any;
}
const initialState: AcademicQualificationDeleteState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

export const DeleteAcademicQualificationByID = createAsyncThunk<any, { url: any; payload: any }>(
  'AcademicQualificationDelete',
  async ({ url, payload }, thunkAPI) => {
    return await Axios.post(`/Sports${url}`, payload).catch(thunkAPI.rejectWithValue)
  }
);

export const AcademicQualificationDeleteSlice = createSlice({
  name: 'AcademicQualificationDelete',
  initialState,
  reducers: {
    clearAcademicQualificationDeleteState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
      state.data = ''
    }
  },
  extraReducers: (builder) => {
    builder.addCase(DeleteAcademicQualificationByID.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(DeleteAcademicQualificationByID.fulfilled, (state, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
    }).addCase(DeleteAcademicQualificationByID.rejected, (state, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearAcademicQualificationDeleteState } = AcademicQualificationDeleteSlice.actions;
export default AcademicQualificationDeleteSlice.reducer;