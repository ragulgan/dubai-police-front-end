import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface GetMedicalTestKpiListState {
 loading: boolean;
 message: string;
 status: 'idle' | 'pending' | 'succeeded' | 'failed';
 error: boolean;
 code: any;
 data: any;
 totalRecords: number;
}
const initialState: GetMedicalTestKpiListState = {
 loading: false,
 message: '',
 status: 'idle',
 error: false,
 code: '',
 data: {},
 totalRecords: 0,
}

export const getMedicalTestKpiList = createAsyncThunk<any, { url: string; payload: any }>(
 'GetMedicalTestKpiList',
 async ({ url, payload }, thunkAPI) => {
  return await Axios.post(`/Sports${url}`, payload).catch(thunkAPI.rejectWithValue)
 }
);

export const GetMedicalTestKpiListSlice = createSlice({
 name: 'GetMedicalTestKpiList',
 initialState,
 reducers: {
  clearGetMedicalTestKpiListState: (state) => {
   state.loading = false;
   state.message = '';
   state.status = 'idle';
   state.error = false;
   state.code = '';
   state.totalRecords = 0;
  }
 },
 extraReducers: (builder) => {
  builder.addCase(getMedicalTestKpiList.pending, (state) => {
   state.loading = true;
   state.message = '';
   state.error = false;
  }).addCase(getMedicalTestKpiList.fulfilled, (state, action: any) => {
   state.loading = false;
   state.status = 'succeeded';
   state.data = action?.payload?.data
   state.message = action?.payload?.description;
   state.code = action?.payload?.responseCode;
   state.totalRecords = action?.payload?.totalRecords;
   state.error = false;
  }).addCase(getMedicalTestKpiList.rejected, (state, action: any) => {
   state.loading = false;
   state.status = 'failed';
   state.code = action?.payload?.data?.responseCode;
   state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
   state.error = true;
  });
 }
});
export const { clearGetMedicalTestKpiListState } = GetMedicalTestKpiListSlice.actions;
export default GetMedicalTestKpiListSlice.reducer;