import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface getTrainingCampByIDInitialState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
  data: any;
}
const initialState: getTrainingCampByIDInitialState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

export const getTrainingCampByID = createAsyncThunk<any, { payload: any }>(
  'getTrainingCampByID',
  async (payload, thunkAPI) => {
    return await Axios.post(`/Sports/getTrainingCampByID`, payload).catch(thunkAPI.rejectWithValue)
  }
);

export const getTrainingCampByIDSlice = createSlice({
  name: 'getTrainingCampByID',
  initialState,
  reducers: {
   clearGetTrainingCampByIDState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getTrainingCampByID.pending, (state: any) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(getTrainingCampByID.fulfilled, (state: any, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
    }).addCase(getTrainingCampByID.rejected, (state: any, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearGetTrainingCampByIDState } = getTrainingCampByIDSlice.actions;
export default getTrainingCampByIDSlice.reducer;