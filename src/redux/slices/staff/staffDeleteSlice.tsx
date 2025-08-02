import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "../../../utils/AxiosInterceptor";

interface Customer {
  id: string;
}

interface CustomersState {
  data: Customer[];
  loading: boolean;
  message: string;
  error: boolean;
  status: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: CustomersState = {
  data: [],
  loading: false,
  message: "",
  error: false,
  status: "idle",
};

export const deleteCustomerById = createAsyncThunk<any, { payload: any }>(
  "customerDelete/delete",
  async (payload: any, thunkAPI) => {
    return await Axios.post<Customer>(`/Sports/DeleteStaffByID`, payload).catch(
      thunkAPI.rejectWithValue
    );
  }
);

export const customersDeleteSlice = createSlice({
  name: "customerDelete",
  initialState,
  reducers: {
    clearDeleteState: (state) => {
      state.data = [];
      state.loading = false;
      state.message = "";
      state.error = false;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteCustomerById.pending, (state) => {
        state.loading = true;
        state.message = "";
        state.error = false;
      })
      .addCase(deleteCustomerById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = "succeeded";
        state.data = action?.payload;
        state.message = action?.payload?.data?.message;
        state.error = false;
      })
      .addCase(deleteCustomerById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = "failed";
        state.message =
          action?.payload?.response?.data?.message || "Something went wrong.";
        state.error = true;
      });
  },
});

export const { clearDeleteState } = customersDeleteSlice.actions;
export default customersDeleteSlice.reducer;