import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "../../../utils/AxiosInterceptor";

export interface NutritionTemplateUpdateState {
  loading: boolean;
  message: string;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: boolean;
  code: any;
  data: any;
}
const initialState: NutritionTemplateUpdateState = {
  loading: false,
  message: "",
  status: "idle",
  error: false,
  code: "",
  data: {},
};

export const updateNutritionTemplate = createAsyncThunk<
  any,
  { url: any; payload: any }
>("NutritionTemplateUpdate", async ({ url, payload }, thunkAPI) => {
  return await Axios.post(`/Sports${url}`, payload).catch(
    thunkAPI.rejectWithValue
  );
});

export const NutritionUpdateSlice = createSlice({
  name: "NutritionTemplateUpdate",
  initialState,
  reducers: {
    clearNutritionTemplateUpdateState: (state) => {
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
      .addCase(updateNutritionTemplate.pending, (state) => {
        state.loading = true;
        state.message = "";
        state.error = false;
      })
      .addCase(updateNutritionTemplate.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = "succeeded";
        state.data = action?.payload?.data;
        state.message = action?.payload?.description;
        state.code = action?.payload?.responseCode;
        state.error = false;
      })
      .addCase(updateNutritionTemplate.rejected, (state, action: any) => {
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
export const { clearNutritionTemplateUpdateState } = NutritionUpdateSlice.actions;
export default NutritionUpdateSlice.reducer;
