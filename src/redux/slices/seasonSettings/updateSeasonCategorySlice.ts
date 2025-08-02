import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "../../../utils/AxiosInterceptor";

export interface UpdateSeasonCategoryState {
  loading: boolean;
  message: string;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: boolean;
  code: any;
  data: any;
  totalRecords: number;
}

const initialState: UpdateSeasonCategoryState = {
  loading: false,
  message: "",
  status: "idle",
  error: false,
  code: "",
  data: {},
  totalRecords: 0,
}

export const updateSeasonCategoryList = createAsyncThunk<any, { url: any; payload: any }>(
  "UpdateSeasonCategory",
  async ({ url, payload }, thunkAPI) => {
    return await Axios.post(url, payload).catch(
      thunkAPI.rejectWithValue
    );
  }
);

export const UpdateSeasonCategorySlice = createSlice({
  name: "UpdateSeasonCategory",
  initialState,
  reducers: {
    clearUpdateSeasonCategoryState: (state) => {
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
      .addCase(updateSeasonCategoryList.pending, (state) => {
        state.loading = true;
        state.message = "";
        state.error = false;
      })
      .addCase(updateSeasonCategoryList.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = "succeeded";
        state.data = action?.payload?.data;
        state.message = action?.payload?.description;
        state.code = action?.payload?.responseCode;
        state.error = false;
        state.totalRecords = action?.payload?.totalRecords;
      })
      .addCase(updateSeasonCategoryList.rejected, (state, action: any) => {
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
export const { clearUpdateSeasonCategoryState } = UpdateSeasonCategorySlice.actions;
export default UpdateSeasonCategorySlice.reducer;