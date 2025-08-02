import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "../../../utils/AxiosInterceptor";
interface MasterState {
  data: {};
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: '',
}

const initialState: MasterState = {
  data: {},
  loading: false,
  message: '',
  error: false,
  status: 'idle',
  code: '',
};
export const deleteMasterById = createAsyncThunk('masterDeletedById/delete', async (data: any, thunkAPI) => {
  return await Axios.post("Sports/DeleteGoalsAndTargetsByID", data).catch(thunkAPI.rejectWithValue)
}
);

export const MasterDeleteSlice=createSlice({
name:'masterDeletedById',
  initialState,
  reducers: {
clearDeleteActivityState: (state) => {
      state.loading = false;
      state.message = "";
      state.error = false;
      state.status = "idle";
      state.code = "";
      state.data = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteMasterById.pending, (state) => {
        state.loading = true;
        state.message = "";
        state.error = false;
      })
      .addCase(deleteMasterById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = "succeeded";
        state.data = action?.payload?.data;
        state.message = action?.payload?.description;
        state.code = action?.payload?.responseCode;
        state.error = false;
      }).addCase(deleteMasterById.rejected, (state, action: any) => {
            state.loading = false;
            state.status = 'failed';
            state.code = action?.payload?.data?.responseCode;
            state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
            state.error = true;
          });
  
  },
});
export const {clearDeleteActivityState} =MasterDeleteSlice.actions;

export default MasterDeleteSlice.reducer;
