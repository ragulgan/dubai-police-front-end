import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "../../../utils/AxiosInterceptor";

export interface BudgetAddState {
  loading: boolean;
  message: string;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: boolean;
  code: any;
  data: any;
  totalRecords: any;
}
const initialState: BudgetAddState = {
  loading: false,
  message: "",
  status: "idle",
  error: false,
  code: "",
  data: {},
  totalRecords: "",
};

export const addBudget = createAsyncThunk<any, { url: any; payload: any }>(
  "BudgetAdd",
  async ({ url, payload }, thunkAPI) => {
    return await Axios.post(`/Sports${url}`, payload).catch(
      thunkAPI.rejectWithValue
    );
  }
);

export const BudgetAddSlice = createSlice({
  name: "BudgetAdd",
  initialState,
  reducers: {
    clearBudgetAddState: (state) => {
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
      .addCase(addBudget.pending, (state) => {
        state.loading = true;
        state.message = "";
        state.error = false;
        state.totalRecords = 0;
      })
      .addCase(addBudget.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = "succeeded";
        state.data = action?.payload?.data;
        state.message = action?.payload?.description;
        state.code = action?.payload?.responseCode;
        state.error = action?.payload?.error;
        state.totalRecords = action?.payload?.totalRecords;
      })
      .addCase(addBudget.rejected, (state, action: any) => {
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
export const { clearBudgetAddState } = BudgetAddSlice.actions;
export default BudgetAddSlice.reducer;
