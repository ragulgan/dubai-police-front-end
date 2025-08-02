import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from '../../../../utils/AxiosInterceptor';

interface ContractState {
  data: any;
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  size: number;
  code: string;

}

const initialState: ContractState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  status: 'idle',
  size: 0,
  code: ''
};

export const getContractTypeAPI = createAsyncThunk<any>(
  'contractType',
  async (payload, thunkAPI) => {
    return await Axios.get(`/settings/contract_type`).catch(thunkAPI.rejectWithValue)
  }
);

export const getContractTypeSlice = createSlice({
  name: 'contractType',
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
      .addCase(getContractTypeAPI.pending, state => {
        state.loading = true;
        state.message = '';
        state.error = false;
        state.status = 'pending';
      })
      .addCase(getContractTypeAPI.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        // state.data = action?.payload?.data
        state.data = [...action.payload.data]

        state.message = action?.payload?.description;
        state.code = action?.payload?.responseCode;
        state.error = false;
      })
      .addCase(getContractTypeAPI.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.code = action?.payload?.responseCode;
        state.message = action?.payload?.description || 'Something went wrong.';
        state.error = true;
      })
  },
});

export const { clearListState } = getContractTypeSlice.actions;
export default getContractTypeSlice.reducer;
