import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "../../../utils/AxiosInterceptor";

export interface TrainingCampTrainingPlan {
  loading: boolean;
  message: string;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: boolean;
  code: any;
  data: any;
}
const initialState: TrainingCampTrainingPlan = {
  loading: false,
  message: "",
  status: "idle",
  error: false,
  code: "",
  data: {},
};

export const addTrainingCampTrainingPlan = createAsyncThunk<
  any,
  { url: any; payload: any }
>("TrainingCampTrainingPlanAdd", async ({ url, payload }, thunkAPI) => {
  return await Axios.post(`/Sports${url}`, payload).catch(
    thunkAPI.rejectWithValue
  );
});

export const TrainingCampTrainingPlanAddSlice = createSlice({
  name: "TrainingCampTrainingPlanAdd",
  initialState,
  reducers: {
    clearAddState: (state) => {
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
      .addCase(addTrainingCampTrainingPlan.pending, (state) => {
        state.loading = true;
        state.message = "";
        state.error = false;
      })
      .addCase(addTrainingCampTrainingPlan.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = "succeeded";
        state.data = action?.payload?.data;
        state.message = action?.payload?.description;
        state.code = action?.payload?.responseCode;
        state.error = false;
      })
      .addCase(addTrainingCampTrainingPlan.rejected, (state, action: any) => {
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
export const { clearAddState } = TrainingCampTrainingPlanAddSlice.actions;
export default TrainingCampTrainingPlanAddSlice.reducer;
