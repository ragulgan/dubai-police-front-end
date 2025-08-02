import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../../../utils/AxiosInterceptor';

interface RoleState {
  data: any;
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  size: number;
  code: string;

}

const initialState: RoleState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  status: 'idle',
  size: 0,
  code: ''
};

export const fetchRoles = createAsyncThunk<any, { payload: any }>(
  'rolesList',
  async (payload, thunkAPI) => {
    return await Axios.post(`/Sports/GetRoleList`, payload).catch(thunkAPI.rejectWithValue)
  }
);

export const rolesSlice = createSlice({
  name: 'rolesList',
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
      .addCase(fetchRoles.pending, state => {
        state.loading = true;
        state.message = '';
        state.error = false;
        state.status = 'pending';
      })
      .addCase(fetchRoles.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = action?.payload?.data
        state.message = action?.payload?.description;
        state.code = action?.payload?.responseCode;
        state.error = false;
      })
      .addCase(fetchRoles.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.code = action?.payload?.responseCode;
        state.message = action?.payload?.description || 'Something went wrong.';
        state.error = true;
      })
  },
});

export const { clearListState } = rolesSlice.actions;
export default rolesSlice.reducer;
