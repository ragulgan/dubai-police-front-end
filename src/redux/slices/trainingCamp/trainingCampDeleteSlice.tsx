import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "../../../utils/AxiosInterceptor";

export interface TrainingCampDeleteState {
  loading: boolean;
  message: string;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: boolean;
  code: any;
  data: any;
}
const initialState: TrainingCampDeleteState = {
  loading: false,
  message: "",
  status: "idle",
  error: false,
  code: "",
  data: {},
};

export const deleteTrainingCamp = createAsyncThunk<
  any,
  { url: any; payload: any }
>("TrainingCampDelete", async ({ url, payload }, thunkAPI) => {
  return await Axios.post(`/Sports${url}`, payload).catch(
    thunkAPI.rejectWithValue
  );
});

export const TrainingCampDeleteSlice = createSlice({
  name: "TrainingCampDelete",
  initialState,
  reducers: {
    clearDeleteState: (state) => {
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
      .addCase(deleteTrainingCamp.pending, (state) => {
        state.loading = true;
        state.message = "";
        state.error = false;
      })
      .addCase(deleteTrainingCamp.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = "succeeded";
        state.data = action?.payload?.data;
        state.message = action?.payload?.description;
        state.code = action?.payload?.responseCode;
        state.error = false;
      })
      .addCase(deleteTrainingCamp.rejected, (state, action: any) => {
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
export const { clearDeleteState } = TrainingCampDeleteSlice.actions;
export default TrainingCampDeleteSlice.reducer;
