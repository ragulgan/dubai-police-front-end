import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "../../../utils/AxiosInterceptor";

export interface RewardsDropdownState {
  loading: boolean;
  message: string;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: boolean;
  code: any;
  data: any;
}
const initialState: RewardsDropdownState = {
  loading: false,
  message: "",
  status: "idle",
  error: false,
  code: "",
  data: {},
};

export const RewardsDropdownList = createAsyncThunk<
  any,
  { url: any; payload: any }
>("RewardsDropdownList", async ({ url, payload }, thunkAPI) => {
  return await Axios.post(`/Sports${url}`, payload).catch(
    thunkAPI.rejectWithValue
  );
});

export const RewardsDropdownListSlice = createSlice({
  name: "RewardsDropdownList",
  initialState,
  reducers: {
    clearRewardsDropdownState: (state) => {
      state.loading = false;
      state.message = "";
      state.status = "idle";
      state.error = false;
      state.data = "";
      state.code = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(RewardsDropdownList.pending, (state) => {
        state.loading = true;
        state.message = "";
        state.error = false;
      })
      .addCase(RewardsDropdownList.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = "succeeded";
        state.data = action?.payload?.data;
        state.message = action?.payload?.description;
        state.code = action?.payload?.responseCode;
        state.error = action?.payload?.error;
      })
      .addCase(RewardsDropdownList.rejected, (state, action: any) => {
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
export const { clearRewardsDropdownState } = RewardsDropdownListSlice.actions;
export default RewardsDropdownListSlice.reducer;
