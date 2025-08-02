import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';



interface SeasonsState {
  data: {}
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: '',
}

const initialState: SeasonsState = {
  data: {},
  loading: false,
  message: '',
  error: false,
  status: 'idle',
  code: '',
};

export const deleteSeasonById = createAsyncThunk('SeasonDelete/delete', async (data: any, thunkAPI) => {
  return await Axios.post("Sports/DeleteGoalsAndTargetsByID", data).catch(thunkAPI.rejectWithValue)
}
);

export const SeasonsDeleteSlice = createSlice({
  name: 'SeasonDelete',
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
    builder.addCase(deleteSeasonById.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    })
      .addCase(deleteSeasonById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = action?.payload?.data
        state.message = action?.payload?.description;
        state.code = action?.payload?.responseCode;
        state.error = false;
      })
      .addCase(deleteSeasonById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.code = action?.payload?.responseCode;
        state.message = action?.payload?.description || 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearDeleteState } = SeasonsDeleteSlice.actions;
export default SeasonsDeleteSlice.reducer;
