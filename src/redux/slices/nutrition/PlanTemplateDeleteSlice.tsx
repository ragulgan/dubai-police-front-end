import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "../../../utils/AxiosInterceptor";

interface PlanTemplatesState {
  data: {};
  loading: boolean;
  message: string;
  error: boolean;
  status: "idle" | "pending" | "succeeded" | "failed";
  code: "";
}

const initialState: PlanTemplatesState = {
  data: {},
  loading: false,
  message: "",
  error: false,
  status: "idle",
  code: "",
};

export const deletePlanTemplateById = createAsyncThunk(
  "PlanTemplateDelete/delete",
  async (data: any, thunkAPI) => {
    return await Axios.post("Sports/DeleteNutritionPlanByID", data).catch(
      thunkAPI.rejectWithValue
    );
  }
);

export const PlanTemplatesDeleteSlice = createSlice({
  name: "PlanTemplateDelete",
  initialState,
  reducers: {
    clearDeleteState: (state) => {
      state.data = [];
      state.loading = false;
      state.message = "";
      state.error = false;
      state.status = "idle";
      state.code = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deletePlanTemplateById.pending, (state) => {
        state.loading = true;
        state.message = "";
        state.error = false;
      })
      .addCase(deletePlanTemplateById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = "succeeded";
        state.data = action?.payload;
        state.message = action?.payload?.description;
        state.code = action?.payload?.responseCode;
        state.error = false;
      })
      .addCase(deletePlanTemplateById.rejected, (state, action: any) => {
        state.loading = false;
        state.status = "failed";
        state.code = action?.payload?.responseCode;
        state.message = action?.payload?.description || "Something went wrong.";
        state.error = true;
      });
  },
});

export const { clearDeleteState } = PlanTemplatesDeleteSlice.actions;
export default PlanTemplatesDeleteSlice.reducer;
