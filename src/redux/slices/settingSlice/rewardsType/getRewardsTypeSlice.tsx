import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../../../utils/AxiosInterceptor';

interface GetRewardsType {
  data: any;
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  size: number;
  code: string;

}

const initialState: GetRewardsType = {
  data: [],
  loading: false,
  message: '',
  error: false,
  status: 'idle',
  size: 0,
  code: ''
};

export const getRewardsTypeAPI = createAsyncThunk<any>(
  'rewardsType',
  async (payload, thunkAPI) => {
    return await Axios.get(`/settings/rewards_type`).catch(thunkAPI.rejectWithValue)
  }
);

export const getRewardsTypeSlice = createSlice({
  name: 'rewardsType',
  initialState,
  reducers: {
    clearListState: (state) => {
      state.data = [];
      state.loading = false;
      state.message = '';
      state.error = false;
      state.status = 'idle';
      state.code = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRewardsTypeAPI.pending, state => {
        state.loading = true;
        state.message = '';
        state.error = false;
        state.status = 'pending';
      })
      .addCase(getRewardsTypeAPI.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        // state.data = action?.payload?.data
        state.data = [...action.payload.data]

        state.message = action?.payload?.description;
        state.code = action?.payload?.responseCode;
        state.error = false;
      })
      .addCase(getRewardsTypeAPI.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.code = action?.payload?.responseCode;
        state.message = action?.payload?.description || 'Something went wrong.';
        state.error = true;
      })
  },
});

export const { clearListState } = getRewardsTypeSlice.actions;
export default getRewardsTypeSlice.reducer;
