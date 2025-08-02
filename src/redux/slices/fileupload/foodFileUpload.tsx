import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "../../../utils/axiosFileInstance";

export interface FoodImageState {
  data: any;
  loading: boolean;
  message: string;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: boolean;
  code: string;
}
const initialState: FoodImageState = {
  data: {},
  loading: false,
  message: "",
  status: "idle",
  error: false,
  code: "",
};
export const foodFileUpload = createAsyncThunk<any, any>(
  "foodFile",
  async (payload: any, thunkAPI) => {
    return await Axios.post("/Sports/FoodImageUpload", payload).catch(
      thunkAPI.rejectWithValue
    );
  }
);

export const singleFileUploadSlice = createSlice({
  name: "foodFile",
  initialState,
  reducers: {
    clearState: (state) => {
      state.data = {};
      state.loading = false;
      state.message = "";
      state.status = "idle";
      state.error = false;
      state.code = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(foodFileUpload.pending, (state) => {
        state.loading = true;
        state.message = "";
        state.error = false;
        state.code = "";
      })
      .addCase(foodFileUpload.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = "succeeded";
        state.code = action?.payload?.responseCode;
        state.data = action?.payload?.data;
        state.message = action?.payload?.description;
        state.error = false;
      })
      .addCase(foodFileUpload.rejected, (state, action: any) => {
        state.loading = false;
        state.status = "failed";
        state.message =
          action?.payload?.response?.data?.message || "Something went wrong.";
        state.error = true;
      });
  },
});
export const { clearState } = singleFileUploadSlice.actions;
export default singleFileUploadSlice.reducer;
