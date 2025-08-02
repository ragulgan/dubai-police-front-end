import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "../../../utils/AxiosInterceptor";

interface Athlete {
  id: string;
}

interface AthletesState {
  data: Athlete[];
  loading: boolean;
  message: string;
  error: boolean;
  status: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: AthletesState = {
  data: [],
  loading: false,
  message: "",
  error: false,
  status: "idle",
};

export const deleteAthleteById = createAsyncThunk<any, { payload: any }>(
  "AthleteDelete/delete",
  async (payload: any, thunkAPI) => {
    return await Axios.post<Athlete>(`/Sports/DeleteAthleteByID`, payload).catch(
      thunkAPI.rejectWithValue
    );
  }
);

export const AthletesDeleteSlice = createSlice({
  name: "AthleteDelete",
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
      .addCase(deleteAthleteById.pending, (state) => {
        state.loading = true;
        state.message = "";
        state.error = false;
      })
      .addCase(deleteAthleteById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = "succeeded";
        state.data = action?.payload;
        state.message = action?.payload?.data?.message;
        state.error = false;
      })
      .addCase(deleteAthleteById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = "failed";
        state.message =
          action?.payload?.response?.data?.message || "Something went wrong.";
        state.error = true;
      });
  },
});

export const { clearDeleteState } = AthletesDeleteSlice.actions;
export default AthletesDeleteSlice.reducer;