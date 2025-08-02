import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface getNutritionPlanDetailByIdInitialState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
  data: any;
}
const initialState: getNutritionPlanDetailByIdInitialState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

export const getNutritionPlanDetailById = createAsyncThunk<any, { payload: any }>(
  'getNutritionPlanDetailById',
  async (payload, thunkAPI) => {
    return await Axios.post(`/Sports/GetNutritionPlanDeatilsByID`, payload).catch(thunkAPI.rejectWithValue)
  }
);

export const getNutritionPlanDetailByIdSlice = createSlice({
  name: 'getNutritionPlanDetailById',
  initialState,
  reducers: {
    clearGetNutritionPlanDetailByIdState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getNutritionPlanDetailById.pending, (state: any) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(getNutritionPlanDetailById.fulfilled, (state: any, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
    }).addCase(getNutritionPlanDetailById.rejected, (state: any, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearGetNutritionPlanDetailByIdState } = getNutritionPlanDetailByIdSlice.actions;
export default getNutritionPlanDetailByIdSlice.reducer;