import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface TestAndMedicalChecksEditState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
  data: any;
}
const initialState: TestAndMedicalChecksEditState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

export const editTestAndMedicalChecks = createAsyncThunk<any, { payload: any }>(
  'TestAndMedicalChecksEdit',
  async (payload, thunkAPI) => {
    return await Axios.post(`/Sports/GetTestAndMedicalChecksByID`, payload).catch(thunkAPI.rejectWithValue)
  }
);

export const TestAndMedicalChecksEditSlice = createSlice({
  name: 'TestAndMedicalChecksEdit',
  initialState,
  reducers: {
    clearTestAndMedicalChecksEditState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.data = '';
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(editTestAndMedicalChecks.pending, (state: any) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(editTestAndMedicalChecks.fulfilled, (state: any, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
    }).addCase(editTestAndMedicalChecks.rejected, (state: any, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearTestAndMedicalChecksEditState } = TestAndMedicalChecksEditSlice.actions;
export default TestAndMedicalChecksEditSlice.reducer;