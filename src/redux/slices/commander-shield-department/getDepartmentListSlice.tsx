import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "../../../utils/AxiosInterceptor";

export interface getDepartmentListSlice {
  loading: boolean;
  message: string;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: boolean;
  code: any;
  data: any;
  totalRecords: number;
}
const initialState: getDepartmentListSlice = {
  loading: false,
  message: "",
  status: "idle",
  error: false,
  code: "",
  data: {},
  totalRecords: 0,
};

export const getDepartmentListAPI = createAsyncThunk<any, { url: string; payload: any }>("getDepartmentList", async ({ url, payload }, thunkAPI) => {
  return await Axios.post(`/Sports${url}`, payload).catch(
    thunkAPI.rejectWithValue
  );
});

export const getDepartmentListSlice = createSlice({
  name: "getDepartmentList",
  initialState,
  reducers: {
    clearGetDepartmentListState: (state) => {
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
      .addCase(getDepartmentListAPI.pending, (state: any) => {
        state.loading = true;
        state.message = "";
        state.error = false;
        state.totalRecords = 0;
      })
      .addCase(getDepartmentListAPI.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.status = "succeeded";
        state.totalRecords = action?.payload?.totalRecords;
        state.data = action?.payload?.data;
        state.message = action?.payload?.description;
        state.code = action?.payload?.responseCode === 200 ? 200 : 500;
        state.error = false;
        state.rejectedCount = action?.payload?.rejectedCount ?? 0;
        state.pendingCount = action?.payload?.pendingCount ?? 0;
        state.fulfilledCount = action?.payload?.fulfilledCount ?? 0;
      })
      .addCase(getDepartmentListAPI.rejected, (state: any, action: any) => {
        state.loading = false;
        state.totalRecords = 0;
        state.status = "failed";
        state.code = action?.payload?.data?.responseCode;
        state.message =
          action?.payload?.response?.data?.description ||
          "Something went wrong.";
        state.error = true;
      });
  },
});
export const { clearGetDepartmentListState } =
  getDepartmentListSlice.actions;
export default getDepartmentListSlice.reducer;
