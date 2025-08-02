import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from '../../../utils/AxiosInterceptor';

interface File {
  id: any;
}

interface FileState {
  data: File[];
  loading: boolean;
  message: string;
  error: boolean;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  code: ''
}

const initialState: FileState = {
  data: [],
  loading: false,
  message: '',
  error: false,
  status: 'idle',
  code: ''
};

export const deleteFile = createAsyncThunk('fileDelete/delete', async (payload: any, thunkAPI) => {
  return await Axios.post<File>(`/Sports/DeleteFilesByID`, payload).catch(thunkAPI.rejectWithValue)
}
);

export const fileDeleteSlice = createSlice({
  name: 'fileDelete',
  initialState,
  reducers: {
    clearDeletFileState: (state) => {
      state.data = [];
      state.loading = false;
      state.message = '';
      state.error = false;
      state.status = 'idle';
      state.code = '';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deleteFile.pending, (state) => {
      state.loading = true;
      state.message = '';
      state.error = false;
    })
      .addCase(deleteFile.fulfilled, (state, action: any) => {
        state.loading = false;
        state.status = 'succeeded';
        state.data = state.data.filter(
          (file) => file.id !== action.payload.id
        );
        state.message = action?.payload?.data?.message;
        state.code = action?.payload?.responseCode;
        state.error = false;
      })
      .addCase(deleteFile.rejected, (state, action: any) => {
        state.loading = false;
        state.status = 'failed';
        state.message = action?.payload?.response?.data?.message || 'Something went wrong.';
        state.error = true;
      });
  },
});

export const { clearDeletFileState } = fileDeleteSlice.actions;
export default fileDeleteSlice.reducer;
