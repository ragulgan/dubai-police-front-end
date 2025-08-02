import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';



interface GoalsTargetssState {
  data: {}
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: '',
}

const initialState: GoalsTargetssState = {
  data: {},
  loading: false,
  message: '',
  error: false,
  status: 'idle',
  code: '',
};

export const deleteGoalsTargetsById = createAsyncThunk('GoalsTargetsDelete/delete', async (data: any, thunkAPI) => {
  return await Axios.post("Sports/DeleteGoalsAndTargetsByID", data).catch(thunkAPI.rejectWithValue)
}
);

export const GoalsTargetssDeleteSlice = createSlice({
  name: 'GoalsTargetsDelete',
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
    builder.addCase(deleteGoalsTargetsById.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    })
      .addCase(deleteGoalsTargetsById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = action?.payload?.data
        state.message = action?.payload?.description;
        state.code = action?.payload?.responseCode;
        state.error = false;
      })
      .addCase(deleteGoalsTargetsById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.code = action?.payload?.responseCode;
        state.message = action?.payload?.description || 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearDeleteState } = GoalsTargetssDeleteSlice.actions;
export default GoalsTargetssDeleteSlice.reducer;
