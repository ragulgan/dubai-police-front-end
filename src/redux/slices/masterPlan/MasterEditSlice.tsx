import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "../../../utils/AxiosInterceptor";
export interface MasterEditState {
  loading: boolean;
  message: string;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: boolean;
  code: any;
  data: any;
}
const initialState: MasterEditState = {
  loading: false,
  message: "",
  status: "idle",
  error: false,
  code: "",
  data: "",
};
export const MasterEditPlan = createAsyncThunk<any, { payload: any }>(
  "masterEditPlan",
  async (payload, thunkAPI) => {
    return await Axios.post(`/Sports/GetSeasonListByID`, payload).catch(
      thunkAPI.rejectWithValue
    );
  }
);
export const MasterEditSlice = createSlice({
  name: "masterEditPlan",
  initialState,
  reducers: {
    clearEditActivityState: (state) => {
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
      .addCase(MasterEditPlan.pending, (state) => {
        state.loading = true;
        state.message = "";
        state.error = false;
      })
      .addCase(MasterEditPlan.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = "succeeded";
        state.data = action?.payload?.data;
        state.message = action?.payload?.description;
        state.code = action?.payload?.responseCode;
        state.error = false;
      })
      .addCase(MasterEditPlan.rejected, (state, action: any) => {
        state.loading = false;
        state.status = "failed";
        state.code = action?.payload?.data?.responseCode;
        state.message =
          action?.payload?.response?.data?.description ||
          "Something went wrong.";
        state.error = true;
      });
  },
});
export const { clearEditActivityState } = MasterEditSlice.actions;

export default MasterEditSlice.reducer;
