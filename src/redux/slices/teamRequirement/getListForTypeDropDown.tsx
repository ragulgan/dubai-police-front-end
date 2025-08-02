import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

export interface getListForTypeDropDownInitialState {
  loading: boolean;
  message: string;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: boolean;
  code: any;
  data: any;
}
const initialState: getListForTypeDropDownInitialState = {
  loading: false,
  message: '',
  status: 'idle',
  error: false,
  code: '',
  data: {}
}

export const getListForTypeDropDownAPI = createAsyncThunk<any, any>(
  'getListForTypeDropDown',
  async (payload, thunkAPI) => {
    return await Axios.post(`/Sports/GetListForTypeDropDown`, payload).catch(thunkAPI.rejectWithValue)
  }
);

export const getListForTypeDropDownSlice = createSlice({
  name: 'getListForTypeDropDown',
  initialState,
  reducers: {
    clearGetListForTypeDropDownState: (state) => {
      state.loading = false;
      state.message = '';
      state.status = 'idle';
      state.error = false;
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getListForTypeDropDownAPI.pending, (state: any) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    }).addCase(getListForTypeDropDownAPI.fulfilled, (state: any, action: any) => {
      state.loading = false;
      state.status = 'succeeded';
      state.data = action?.payload?.data
      state.message = action?.payload?.description;
      state.code = action?.payload?.responseCode;
      state.error = false;
    }).addCase(getListForTypeDropDownAPI.rejected, (state: any, action: any) => {
      state.loading = false;
      state.status = 'failed';
      state.code = action?.payload?.data?.responseCode;
      state.message = action?.payload?.response?.data?.description || 'Something went wrong.';
      state.error = true;
    });
  }
});
export const { clearGetListForTypeDropDownState } = getListForTypeDropDownSlice.actions;
export default getListForTypeDropDownSlice.reducer;