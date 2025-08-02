import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "../../../utils/AxiosInterceptor";

export interface GetTopPerformingSportsState {
  loading: boolean;
  message: string;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: boolean;
  code: any;
  data: any;
  totalRecords: any;
}
const initialState: GetTopPerformingSportsState = {
  loading: false,
  message: "",
  status: "idle",
  error: false,
  code: "",
  data: {},
  totalRecords: "",
};

export const getTopPerformingSports = createAsyncThunk<
  any,
  { url: any; payload: any }
>("GetTopPerformingSports", async ({ url, payload }, thunkAPI) => {
  return await Axios.post(`/Sports${url}`, payload).catch(
    thunkAPI.rejectWithValue
  );
});

export const GetTopPerformingSportsSlice = createSlice({
  name: "GetTopPerformingSports",
  initialState,
  reducers: {
    clearGetTopPerformingSportsState: (state) => {
      state.loading = false;
      state.message = "";
      state.status = "idle";
      state.error = false;
      state.code = "";
      state.data = "";
      state.totalRecords = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTopPerformingSports.pending, (state) => {
        state.loading = true;
        state.message = "";
        state.error = false;
        state.totalRecords = 0;
      })
      .addCase(getTopPerformingSports.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = "succeeded";
        state.data = action?.payload?.data;
        state.message = action?.payload?.description;
        state.code = action?.payload?.responseCode;
        state.error = action?.payload?.error;
        state.totalRecords = action?.payload?.totalRecords;
      })
      .addCase(getTopPerformingSports.rejected, (state, action: any) => {
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
export const { clearGetTopPerformingSportsState } =
  GetTopPerformingSportsSlice.actions;
export default GetTopPerformingSportsSlice.reducer;
