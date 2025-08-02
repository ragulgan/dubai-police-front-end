import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "../../../utils/AxiosInterceptor";

interface TestAndMedicalChecks {
  id: string;
}

interface TestAndMedicalCheckssState {
  data: TestAndMedicalChecks[];
  loading: boolean;
  message: string;
  error: boolean;
  status: "idle" | "pending" | "succeeded" | "failed";
  code: any
}

const initialState: TestAndMedicalCheckssState = {
  data: [],
  loading: false,
  message: "",
  error: false,
  status: "idle",
  code: ""
};

export const deleteTestAndMedicalChecksById = createAsyncThunk<any, { payload: any }>(
  "TestAndMedicalChecksDelete/delete",
  async (payload: any, thunkAPI) => {
    return await Axios.post<TestAndMedicalChecks>(`/Sports/DeleteTestAndMedicalChecksByID`, payload).catch(
      thunkAPI.rejectWithValue
    );
  }
);

export const TestAndMedicalCheckssDeleteSlice = createSlice({
  name: "TestAndMedicalChecksDelete",
  initialState,
  reducers: {
    clearDeleteestAndMedicalChecksState: (state) => {
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
      .addCase(deleteTestAndMedicalChecksById.pending, (state) => {
        state.loading = true;
        state.message = "";
        state.error = false;
      })
      .addCase(deleteTestAndMedicalChecksById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = "succeeded";
        state.data = action?.payload?.data;
        state.message = action?.payload?.data?.message;
        state.error = false;
        state.code = action?.payload?.responseCode
      })
      .addCase(deleteTestAndMedicalChecksById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = "failed";
        state.message =
          action?.payload?.response?.data?.message || "Something went wrong.";
        state.error = true;
      });
  },
});

export const { clearDeleteestAndMedicalChecksState } = TestAndMedicalCheckssDeleteSlice.actions;
export default TestAndMedicalCheckssDeleteSlice.reducer;