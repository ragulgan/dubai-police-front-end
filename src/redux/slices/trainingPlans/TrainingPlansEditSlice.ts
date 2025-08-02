import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface TrainingPlansEditState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
  data: any;
}
const initialState: TrainingPlansEditState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

export const editTrainingPlans = createAsyncThunk<any, { payload: any }>(
  'TrainingPlansEdit',
  async (payload, thunkAPI) => {
    return await Axios.post(`/Sports/GetTrainingPlanByID`, payload).catch(thunkAPI.rejectWithValue)
  }
);

export const TrainingPlansEditSlice = createSlice({
  name: 'TrainingPlansEdit',
  initialState,
  reducers: {
    clearEditState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.data = '';
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(editTrainingPlans.pending, (state: any) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(editTrainingPlans.fulfilled, (state: any, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
    }).addCase(editTrainingPlans.rejected, (state: any, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearEditState } = TrainingPlansEditSlice.actions;
export default TrainingPlansEditSlice.reducer;