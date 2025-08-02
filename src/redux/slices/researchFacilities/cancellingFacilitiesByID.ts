import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "../../../utils/AxiosInterceptor";

export interface CancelFacilitiesByIDState {
  loading: boolean;
  message: string;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: boolean;
  code: any;
  data: any;
  totalRecords: number;
}
const initialState: CancelFacilitiesByIDState = {
  loading: false,
  message: "",
  status: "idle",
  error: false,
  code: "",
  data: {},
  totalRecords: 0,
};

export const cancelFacilitiesByID = createAsyncThunk<any, { url: any; payload: any }>(
  "CancelFacilitiesByID",
  async ({ url, payload }, thunkAPI) => {
    return await Axios.post(`/Sports${url}`, payload).catch(
      thunkAPI.rejectWithValue
    );
  }
);

export const CancelFacilitiesByIDSlice = createSlice({
  name: "CancelFacilitiesByID",
  initialState,
  reducers: {
    clearCancelFacilitiesByIDState: (state) => {
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
      .addCase(cancelFacilitiesByID.pending, (state) => {
        state.loading = true;
        state.message = "";
        state.error = false;
      })
      .addCase(cancelFacilitiesByID.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = "succeeded";
        state.data = action?.payload?.data;
        state.message = action?.payload?.description;
        state.code = action?.payload?.responseCode;
        state.error = false;
        state.totalRecords = action?.payload?.totalRecords;
      })
      .addCase(cancelFacilitiesByID.rejected, (state, action: any) => {
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
export const { clearCancelFacilitiesByIDState } = CancelFacilitiesByIDSlice.actions;
export default CancelFacilitiesByIDSlice.reducer;
