import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface ReportGetByIDState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
  data: any;
}
const initialState: ReportGetByIDState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

export const getReportByID = createAsyncThunk<any, { url: any }>(
  'ReportGetByID',
  async ({ url }, thunkAPI) => {

    return await Axios.get(`${url}`
      // ,

      // {
      //   headers: {
      //     "Content-Type": "multipart/form-data", // Optional: Axios usually sets this automatically
      //   },
      // }
    ).catch(thunkAPI.rejectWithValue)
  }
);

export const reportGetByIDSlice = createSlice({
  name: 'ReportGetByID',
  initialState,
  reducers: {
    clearReportUpdateState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
    },
    clearAllReportUpdateState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
      state.data = {};
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getReportByID.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(getReportByID.fulfilled, (state, action: any) => {
      console.log({ action })

      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
    }).addCase(getReportByID.rejected, (state, action: any) => {
      console.log({ action })

      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearReportUpdateState, clearAllReportUpdateState } = reportGetByIDSlice.actions;
export default reportGetByIDSlice.reducer;