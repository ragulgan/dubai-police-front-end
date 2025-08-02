import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface IndividualMilestoneUpdateState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: string;
  data: object;
}
const initialState: IndividualMilestoneUpdateState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

export const UpdateIndividualMilestone = createAsyncThunk<any, any>(
  'IndividualMilestoneUpdate',
  async (data, thunkAPI) => {
    return await Axios.post("Sports/UpdateMilestoneByID", data).catch(thunkAPI.rejectWithValue)
  }
);

export const IndividualMilestoneUpdateSlice = createSlice({
  name: 'IndividualMilestoneUpdate',
  initialState,
  reducers: {
    clearUpdateState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
      state.data = {};
    }
  },
  extraReducers: (builder) => {
    builder.addCase(UpdateIndividualMilestone.pending, (state: any) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(UpdateIndividualMilestone.fulfilled, (state: any, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
    }).addCase(UpdateIndividualMilestone.rejected, (state: any, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearUpdateState } = IndividualMilestoneUpdateSlice.actions;
export default IndividualMilestoneUpdateSlice.reducer;