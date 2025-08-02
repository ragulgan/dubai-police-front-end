import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface TestAndMedicalChecksUpdateState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: string;
  data: object;
}
const initialState: TestAndMedicalChecksUpdateState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

export const UpdateTestAndMedicalChecksByID = createAsyncThunk<any, { payload: any }>(
  'TestAndMedicalChecksUpdate',
  async (payload, thunkAPI) => {
    return await Axios.post("Sports/UpdateTestAndMedicalChecksByID", payload).catch(thunkAPI.rejectWithValue)
  }
);

export const TestAndMedicalChecksUpdateSlice = createSlice({
  name: 'TestAndMedicalChecksUpdate',
  initialState,
  reducers: {
    clearTestAndMedicalChecksUpdateState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(UpdateTestAndMedicalChecksByID.pending, (state: any) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(UpdateTestAndMedicalChecksByID.fulfilled, (state: any, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
    }).addCase(UpdateTestAndMedicalChecksByID.rejected, (state: any, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearTestAndMedicalChecksUpdateState } = TestAndMedicalChecksUpdateSlice.actions;
export default TestAndMedicalChecksUpdateSlice.reducer;