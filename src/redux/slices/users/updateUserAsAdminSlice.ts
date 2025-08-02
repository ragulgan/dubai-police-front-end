import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "../../../utils/AxiosInterceptor";

export interface UpdateUserAsAdminState {
  loading: boolean;
  message: string;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: boolean;
  code: any;
  data: any;
  totalRecords: number;
}

const initialState: UpdateUserAsAdminState = {
  loading: false,
  message: "",
  status: "idle",
  error: false,
  code: "",
  data: {},
  totalRecords: 0,
}

export const updateUserAsAdmin = createAsyncThunk<any, { url: any; payload: any }>(
  "UpdateUserAsAdminList",
  async ({ url, payload }, thunkAPI) => {
    return await Axios.post(url, payload).catch(
      thunkAPI.rejectWithValue
    );
  }
);

export const updateUserAsAdminSlice = createSlice({
  name: "UpdateUserAsAdminList",
  initialState,
  reducers: {
    clearUpdateUserAsAdminState: (state) => {
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
      .addCase(updateUserAsAdmin.pending, (state) => {
        state.loading = true;
        state.message = "";
        state.error = false;
      })
      .addCase(updateUserAsAdmin.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = "succeeded";
        state.data = action?.payload?.data;
        state.message = action?.payload?.description;
        state.code = action?.payload?.responseCode;
        state.error = false;
        state.totalRecords = action?.payload?.totalRecords;
      })
      .addCase(updateUserAsAdmin.rejected, (state, action: any) => {
        state.loading = false;
        state.status = "failed";
        state.code = action?.payload?.data?.responseCode;
        state.message =
          action?.payload?.response?.data?.description ||
          "Unable to succeed action.";
        state.error = true;
      });
  },
});
export const { clearUpdateUserAsAdminState } = updateUserAsAdminSlice.actions;
export default updateUserAsAdminSlice.reducer;