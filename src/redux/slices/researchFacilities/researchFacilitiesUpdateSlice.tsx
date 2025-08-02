import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "../../../utils/AxiosInterceptor";

export interface ResearchAndFacilitiesUpdateState {
  loading: boolean;
  message: string;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: boolean;
  code: any;
  data: any;
  totalRecords: number;
}
const initialState: ResearchAndFacilitiesUpdateState = {
  loading: false,
  message: "",
  status: "idle",
  error: false,
  code: "",
  data: {},
  totalRecords: 0,
};

export const updateResearchAndFacilities = createAsyncThunk<any, { url: any; payload: any }>(
  "ResearchAndFacilitiesUpdate",
  async ({ url, payload }, thunkAPI) => {
    return await Axios.post(`/Sports${url}`, payload).catch(
      thunkAPI.rejectWithValue
    );
  }
);

export const ResearchAndFacilitiesUpdateSlice = createSlice({
  name: "ResearchAndFacilitiesUpdate",
  initialState,
  reducers: {
    clearResearchAndFacilitiesUpdateState: (state) => {
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
      .addCase(updateResearchAndFacilities.pending, (state) => {
        state.loading = true;
        state.message = "";
        state.error = false;
      })
      .addCase(updateResearchAndFacilities.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = "succeeded";
        state.data = action?.payload?.data;
        state.message = action?.payload?.description;
        state.code = action?.payload?.responseCode;
        state.error = false;
        state.totalRecords = action?.payload?.totalRecords;
      })
      .addCase(updateResearchAndFacilities.rejected, (state, action: any) => {
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
export const { clearResearchAndFacilitiesUpdateState } = ResearchAndFacilitiesUpdateSlice.actions;
export default ResearchAndFacilitiesUpdateSlice.reducer;
