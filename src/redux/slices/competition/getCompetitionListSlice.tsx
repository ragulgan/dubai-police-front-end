import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "../../../utils/AxiosInterceptor";

export interface getCompetitionListSlice {
  loading: boolean;
  message: string;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: boolean;
  code: any;
  data: any;
  totalRecords: number;
}
const initialState: getCompetitionListSlice = {
  loading: false,
  message: "",
  status: "idle",
  error: false,
  code: "",
  data: {},
  totalRecords: 0,
};

export const getCompetitionListAPI = createAsyncThunk<any, { url: string; payload: any }>("getCompetitionList", async ({ url, payload }, thunkAPI) => {
  return await Axios.post(`/Sports${url}`, payload).catch(
    thunkAPI.rejectWithValue
  );
});

export const getCompetitionListSlice = createSlice({
  name: "getCompetitionList",
  initialState,
  reducers: {
    clearGetCompetitionListState: (state) => {
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
      .addCase(getCompetitionListAPI.pending, (state: any) => {
        state.loading = true;
        state.message = "";
        state.error = false;
        state.totalRecords = 0;
      })
      .addCase(getCompetitionListAPI.fulfilled, (state: any, action: any) => {
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
      .addCase(getCompetitionListAPI.rejected, (state: any, action: any) => {
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
export const { clearGetCompetitionListState } =
  getCompetitionListSlice.actions;
export default getCompetitionListSlice.reducer;
