import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface TestAndMedicalByAtheleteEditState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
  data: any;
}
const initialState: TestAndMedicalByAtheleteEditState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

export const editTestAndMedicalByAtheleteEdit = createAsyncThunk<any, { payload: any }>(
  'TestAndMedicalByAtheleteEdit',
  async (payload, thunkAPI) => {
    return await Axios.post(`/Sports/GetTestAndMedicalByAthletID`, payload).catch(thunkAPI.rejectWithValue)
  }
);

export const TestAndMedicalByAtheleteEditSlice = createSlice({
  name: 'TestAndMedicalByAtheleteEdit',
  initialState,
  reducers: {
    clearTestAndMedicalByAtheleteEditState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.data = '';
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(editTestAndMedicalByAtheleteEdit.pending, (state: any) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(editTestAndMedicalByAtheleteEdit.fulfilled, (state: any, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
    }).addCase(editTestAndMedicalByAtheleteEdit.rejected, (state: any, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearTestAndMedicalByAtheleteEditState } = TestAndMedicalByAtheleteEditSlice.actions;
export default TestAndMedicalByAtheleteEditSlice.reducer;