import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface ReportFileUploadState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
  data: any;
}
const initialState: ReportFileUploadState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

export const uploadFileReport = createAsyncThunk<any, { url: any; payload: any }>(
  'ReportFileUpload',
  async ({ url, payload }, thunkAPI) => {
    console.log({payload});
    
    return await Axios.put(`${url}`, payload,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Optional: Axios usually sets this automatically
        },
      }
    ).catch(thunkAPI.rejectWithValue)
  }
);

export const ReportFileUploadSlice = createSlice({
  name: 'ReportFileUpload',
  initialState,
  reducers: {
    clearReportAddState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
    },
    clearFileUploadState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
      state.data = {};
    },

  },
  extraReducers: (builder) => {
    builder.addCase(uploadFileReport.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(uploadFileReport.fulfilled, (state, action: any) => {
      console.log({action})
      
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
    }).addCase(uploadFileReport.rejected, (state, action: any) => {
            console.log({action})

      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearReportAddState,clearFileUploadState } = ReportFileUploadSlice.actions;
export default ReportFileUploadSlice.reducer;