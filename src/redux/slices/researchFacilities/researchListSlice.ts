import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "../../../utils/AxiosInterceptor";

export interface ResearchListState {
  loading: boolean;
  message: string;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: boolean;
  code: any;
  data: any;
  totalRecords: number;
}

const initialState: ResearchListState = {
  loading: false,
  message: "",
  status: "idle",
  error: false,
  code: "",
  data: {},
  totalRecords: 0,
}

export const listResearch = createAsyncThunk<any, { url: any; payload: any }>(
  "ResearchList",
  async ({ url, payload }, thunkAPI) => {
    return await Axios.post(`/Sports${url}`, payload).catch(
      thunkAPI.rejectWithValue
    );
  }
);

export const ResearchListSlice = createSlice({
  name: "ResearchList",
  initialState,
  reducers: {
    clearResearchListState: (state) => {
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
      .addCase(listResearch.pending, (state) => {
        state.loading = true;
        state.message = "";
        state.error = false;
      })
      .addCase(listResearch.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = "succeeded";
        state.data = action?.payload?.data;
        state.message = action?.payload?.description;
        state.code = action?.payload?.responseCode;
        state.error = false;
        state.totalRecords = action?.payload?.totalRecords;
      })
      .addCase(listResearch.rejected, (state, action: any) => {
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
export const { clearResearchListState } = ResearchListSlice.actions;
export default ResearchListSlice.reducer;