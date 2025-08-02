import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface getRaceReportListSlice {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
  data: any;
  totalRecords: number;
}
const initialState: getRaceReportListSlice = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {},
  totalRecords: 0,
}

// export const getRaceReportListAPI = createAsyncThunk<any, any>(
//   'getRaceReport',
//   async (payload, thunkAPI) => {

//     return await Axios.post(`/Sports/GetAthleteList`, payload).catch(thunkAPI.rejectWithValue)
//   }
// );

export const getRaceReportListAPI = createAsyncThunk<any, { url: any}>(
  'getRaceReport',
  async ({ url}, thunkAPI) => {
    console.log({url});
    
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
// export const getRaceReportListAPI = createAsyncThunk<any, any>(
//   'getRaceReport',
//   async (payload, thunkAPI) => {

//     return await Axios.post(`/Sports/GetAthleteList`, payload).catch(thunkAPI.rejectWithValue)
//   }
// );

export const getReportList = createSlice({
  name: 'getRaceReport',
  initialState,
  reducers: {
    clearGetRaceReportListState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
      state.totalRecords = 0;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getRaceReportListAPI.pending, (state: any) => {
      state.loading = true;
      state.message = '';
      state.error = false;
      state.totalRecords = 0;
    }).addCase(getRaceReportListAPI.fulfilled, (state: any, action: any) => {
      console.log({state,action});
      
      state.loading = false;
      state.status = 'succeeded';
      state.totalRecords = action?.payload?.totalRecords;
      state.data = action?.payload?.data;
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode === 200 ? 200 : 500;
      state.error = false;
    }).addCase(getRaceReportListAPI.rejected, (state: any, action: any) => {
      state.loading = false;
      state.totalRecords = 0;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearGetRaceReportListState } = getReportList.actions;
export default getReportList.reducer;