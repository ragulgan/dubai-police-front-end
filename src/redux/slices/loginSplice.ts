import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "../../utils/AxiosInterceptor";

interface LoginState {
  isLoading: boolean;
  data: any;
  loading: boolean;
  message: string;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: boolean;
  code: any;
}

const initialState: LoginState = {
  isLoading: false,
  data: {},
  loading: false,
  message: "",
  status: "idle",
  error: false,
  code: "",
};

export const fetchLoginAsync = createAsyncThunk<any, any>(
  "login",
  async (payload: any, thunkAPI) => {
    return await Axios.post("/Login/AuthendicateUser", payload).catch(
      thunkAPI.rejectWithValue
    );
  }
);

const LoginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = false;
      state.code = "";
      state.isLoading = false;
      state.data = {};
      state.loading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(fetchLoginAsync.fulfilled, (state, action: any) => {
        state.isLoading = false;
        state.data = action.payload.data;
        state.message = action?.payload?.description;
        state.code = action?.payload?.responseCode;
        state.error = false;
        if (action.payload.status !== "ok") {
          state.error = action.payload.message;
        }
      })
      .addCase(fetchLoginAsync.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = false;
        state.code = action?.payload?.responseCode;
      });
  },
});
export const { clearError } = LoginSlice.actions;
export default LoginSlice.reducer;
