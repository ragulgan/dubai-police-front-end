import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';



interface NutritionsState {
  data: {}
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: '',
}

const initialState: NutritionsState = {
  data: {},
  loading: false,
  message: '',
  error: false,
  status: 'idle',
  code: '',
};

export const deleteNutritionById = createAsyncThunk('NutritionDelete/delete', async (data: any, thunkAPI) => {
  return await Axios.post("Sports/DeleteNutritionByID", data).catch(thunkAPI.rejectWithValue)
}
);

export const NutritionsDeleteSlice = createSlice({
  name: 'NutritionDelete',
  initialState,
  reducers: {
    clearDeleteState: (state) => {
      state.data = [];
      state.loading = false;
      state.message = '';
      state.error = false;
      state.status = 'idle';
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(deleteNutritionById.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    })
      .addCase(deleteNutritionById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = action?.payload
        state.message = action?.payload?.description;
        state.code = action?.payload?.responseCode;
        state.error = false;
      })
      .addCase(deleteNutritionById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.code = action?.payload?.responseCode;
        state.message = action?.payload?.description || 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearDeleteState } = NutritionsDeleteSlice.actions;
export default NutritionsDeleteSlice.reducer;
