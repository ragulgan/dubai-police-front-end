import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "../../../utils/AxiosInterceptor";

interface Results {
  id: string;
}

interface ResultssState {
  data: Results[];
  loading: boolean;
  message: string;
  error: boolean;
  status: "idle" | "pending" | "succeeded" | "failed";
  code: any
}

const initialState: ResultssState = {
  data: [],
  loading: false,
  message: "",
  error: false,
  status: "idle",
  code: ""
};

export const deleteResultsById = createAsyncThunk<any, { payload: any }>(
  "ResultsDelete/delete",
  async (payload: any, thunkAPI) => {
    return await Axios.post<Results>(`/Sports/DeleteTrainingPlanByID`, payload).catch(
      thunkAPI.rejectWithValue
    );
  }
);

export const ResultssDeleteSlice = createSlice({
  name: "ResultsDelete",
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
      .addCase(deleteResultsById.pending, (state) => {
        state.loading = true;
        state.message = "";
        state.error = false;
      })
      .addCase(deleteResultsById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = "succeeded";
        state.data = action?.payload?.data;
        state.message = action?.payload?.data?.message;
        state.error = false;
        state.code = action?.payload?.responseCode
      })
      .addCase(deleteResultsById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = "failed";
        state.message =
          action?.payload?.response?.data?.message || "Something went wrong.";
        state.error = true;
      });
  },
});

export const { clearDeleteState } = ResultssDeleteSlice.actions;
export default ResultssDeleteSlice.reducer;