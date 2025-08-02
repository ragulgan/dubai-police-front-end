import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "../../../utils/AxiosInterceptor";

export interface RewardsAddState {
  loading: boolean;
  message: string;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: boolean;
  code: any;
  data: any;
}
const initialState: RewardsAddState = {
  loading: false,
  message: "",
  status: "idle",
  error: false,
  code: "",
  data: {},
};

export const addRewards = createAsyncThunk<any, { url: any; payload: any }>(
  "RewardsAdd",
  async ({ url, payload }, thunkAPI) => {
    return await Axios.post(`/Sports${url}`, payload).catch(
      thunkAPI.rejectWithValue
    );
  }
);

export const RewardsAddSlice = createSlice({
  name: "RewardsAdd",
  initialState,
  reducers: {
    clearAddState: (state) => {
      state.loading = false;
      state.message = "";
      state.status = "idle";
      state.error = false;
      state.code = "";
      state.data = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addRewards.pending, (state) => {
        state.loading = true;
        state.message = "";
        state.error = false;
      })
      .addCase(addRewards.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = "succeeded";
        state.data = action?.payload?.data;
        state.message = action?.payload?.description;
        state.code = action?.payload?.responseCode;
        state.error = action?.payload?.error;
      })
      .addCase(addRewards.rejected, (state, action: any) => {
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
export const { clearAddState } = RewardsAddSlice.actions;
export default RewardsAddSlice.reducer;
