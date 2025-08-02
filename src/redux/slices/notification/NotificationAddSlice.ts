import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "../../../utils/AxiosInterceptor";

export interface NotificationAddState {
  loading: boolean;
  message: string;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: boolean;
  code: any;
  data: any;
}
const initialState: NotificationAddState = {
  loading: false,
  message: "",
  status: "idle",
  error: false,
  code: "",
  data: {},
};

export const addNotification = createAsyncThunk<
  any,
  { url: any; payload: any }
>("NotificationAdd", async ({ url, payload }, thunkAPI) => {
  return await Axios.post(`/Sports${url}`, payload).catch(
    thunkAPI.rejectWithValue
  );
});

export const NotificationAddSlice = createSlice({
  name: "NotificationAdd",
  initialState,
  reducers: {
    clearNotificationAddState: (state) => {
      state.loading = false;
      state.message = "";
      state.status = "idle";
      state.error = false;
      state.code = "";
      state.data = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addNotification.pending, (state) => {
        state.loading = true;
        state.message = "";
        state.error = false;
      })
      .addCase(addNotification.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = "succeeded";
        state.data = action?.payload?.data;
        state.message = action?.payload?.description;
        state.code = action?.payload?.responseCode;
        state.error = false;
      })
      .addCase(addNotification.rejected, (state, action: any) => {
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
export const { clearNotificationAddState } = NotificationAddSlice.actions;
export default NotificationAddSlice.reducer;
