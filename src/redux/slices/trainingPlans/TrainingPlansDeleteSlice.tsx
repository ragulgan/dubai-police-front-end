import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "../../../utils/AxiosInterceptor";

interface TrainingPlans {
  id: string;
}

interface TrainingPlanssState {
  data: TrainingPlans[];
  loading: boolean;
  message: string;
  error: boolean;
  status: "idle" | "pending" | "succeeded" | "failed";
  code: any
}

const initialState: TrainingPlanssState = {
  data: [],
  loading: false,
  message: "",
  error: false,
  status: "idle",
  code: ""
};

export const deleteTrainingPlansById = createAsyncThunk<any, { payload: any }>(
  "TrainingPlansDelete/delete",
  async (payload: any, thunkAPI) => {
    return await Axios.post<TrainingPlans>(`/Sports/DeleteTrainingPlanByID`, payload).catch(
      thunkAPI.rejectWithValue
    );
  }
);

export const TrainingPlanssDeleteSlice = createSlice({
  name: "TrainingPlansDelete",
  initialState,
  reducers: {
    clearDeleteState: (state) => {
      state.data = [];
      state.loading = false;
      state.message = "";
      state.error = false;
      state.status = "idle";
      state.code = ""
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteTrainingPlansById.pending, (state) => {
        state.loading = true;
        state.message = "";
        state.error = false;
      })
      .addCase(deleteTrainingPlansById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = "succeeded";
        state.data = action?.payload?.data;
        state.message = action?.payload?.data?.message;
        state.error = false;
        state.code = action?.payload?.responseCode
      })
      .addCase(deleteTrainingPlansById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = "failed";
        state.message =
          action?.payload?.response?.data?.message || "Something went wrong.";
        state.error = true;
      });
  },
});

export const { clearDeleteState } = TrainingPlanssDeleteSlice.actions;
export default TrainingPlanssDeleteSlice.reducer;