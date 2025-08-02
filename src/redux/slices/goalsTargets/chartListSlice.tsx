import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface ChartListState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
  data: any;
  totalRecords: number;
}
const initialState: ChartListState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {},
  totalRecords: 0
}



export const listChart = createAsyncThunk<any, any>(
  'GoalsTargetsUpdate',
  async (data, thunkAPI) => {
    return await Axios.post("Sports/GetMilestoneChart", data).catch(thunkAPI.rejectWithValue)
  }
);

export const ChartListSlice = createSlice({
  name: 'ChartList',
  initialState,
  reducers: {
    clearListState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
      state.totalRecords = 0;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(listChart.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(listChart.fulfilled, (state, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
      state.totalRecords = action?.payload?.totalRecords
    }).addCase(listChart.rejected, (state, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearListState } = ChartListSlice.actions;
export default ChartListSlice.reducer;