import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface NutritionEditState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
  data: any;
}
const initialState: NutritionEditState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

export const editNutrition = createAsyncThunk<any, { payload: any }>(
  'NutritionEdit',
  async (payload, thunkAPI) => {
    return await Axios.post(`/Sports/GetNutritionByID`, payload).catch(thunkAPI.rejectWithValue)
  }
);

export const NutritionEditSlice = createSlice({
  name: 'NutritionEdit',
  initialState,
  reducers: {
    clearEditState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(editNutrition.pending, (state: any) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(editNutrition.fulfilled, (state: any, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
    }).addCase(editNutrition.rejected, (state: any, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearEditState } = NutritionEditSlice.actions;
export default NutritionEditSlice.reducer;