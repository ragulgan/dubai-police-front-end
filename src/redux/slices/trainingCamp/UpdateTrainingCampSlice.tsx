import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface updateTrainingCamp {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: string;
  data: object;
}
const initialState: updateTrainingCamp = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

// export const UpdateTrainingCampByID = createAsyncThunk<any, { payload: any }>(
//   'updateTrainingCamp',
//   async (payload, thunkAPI) => {
//     return await Axios.post("Sports/UpdateTrainingCampByID", payload).catch(thunkAPI.rejectWithValue)
//   }
// );


export const UpdateTrainingCampByID = createAsyncThunk<any, { url: string; payload: any }>(
  'updateTrainingCamp',
  async ({ url, payload }, thunkAPI) => {
    return await Axios.post(`/Sports${url}`, payload).catch(thunkAPI.rejectWithValue)
  }
);


export const updateTrainingCampSlice = createSlice({
  name: 'updateTrainingCamp',
  initialState,
  reducers: {
    clearUpdateTrainingCamp: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(UpdateTrainingCampByID.pending, (state: any) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(UpdateTrainingCampByID.fulfilled, (state: any, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
    }).addCase(UpdateTrainingCampByID.rejected, (state: any, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearUpdateTrainingCamp } = updateTrainingCampSlice.actions;
export default updateTrainingCampSlice.reducer;