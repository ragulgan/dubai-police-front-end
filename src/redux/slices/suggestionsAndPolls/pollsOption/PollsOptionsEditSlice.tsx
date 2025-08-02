import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "../../../../utils/AxiosInterceptor";

export interface PollsOptionsEditState {
  loading: boolean;
  message: string;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: boolean;
  code: any;
  data: any;
  totalRecords: number;
}
const initialState: PollsOptionsEditState = {
  loading: false,
  message: "",
  status: "idle",
  error: false,
  code: "",
  data: {},
  totalRecords: 0,
};

export const editPollsOptions = createAsyncThunk<any, { url: any; payload: any }>(
  "PollsOptionsEdit",
  async ({ url, payload }, thunkAPI) => {
    return await Axios.post(`/Sports${url}`, payload).catch(
      thunkAPI.rejectWithValue
    );
  }
);

export const PollsOptionsEditSlice = createSlice({
  name: "PollsOptionsEdit",
  initialState,
  reducers: {
    clearPollsOptionsEditState: (state) => {
      state.loading = false;
      state.message = "";
      state.status = "idle";
      state.error = false;
      state.code = "";
      state.totalRecords = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(editPollsOptions.pending, (state) => {
        state.loading = true;
        state.message = "";
        state.error = false;
      })
      .addCase(editPollsOptions.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = "succeeded";
        state.data = action?.payload?.data;
        state.message = action?.payload?.description;
        state.code = action?.payload?.responseCode;
        state.error = false;
        state.totalRecords = action?.payload?.totalRecords;
      })
      .addCase(editPollsOptions.rejected, (state, action: any) => {
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
export const { clearPollsOptionsEditState } = PollsOptionsEditSlice.actions;
export default PollsOptionsEditSlice.reducer;
