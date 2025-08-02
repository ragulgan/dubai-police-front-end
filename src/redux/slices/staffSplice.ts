// import { fetchStaffs } from "@/app/api/mockApi"; // Ensure this is the correct import
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type for a Staff
interface Staff {
  id: number;
  title: string;
  description: string;
}

// Define the type for the slice state
interface StaffsState {
  isLoading: boolean;
  data: Staff[];
}

// Define the type for the new staff payload
interface NewStaffPayload {
  name: string;
  surname: string;
  gender: string;
  role: string;
  nationality: string;
  dob: string;
  age: number;
  placeOfBirth: string;
  passportNo: string;
  idDocument: string;
  // profileImage: string,
  // passportPdf: string,
  // iDdocumentImage: string,
}

// Initial state with type annotation
const initialState: StaffsState = {
  isLoading: false,
  data: [],
};

// Async thunk for fetching Staffs
// Async thunk for fetching Staffs
export const fetchStaffsAsync = createAsyncThunk<Staff[], void>(
  "Staff/fetchStaffsAsync",
  async () => {
    const response = await fetch(
      `${process.env.API_BASE_URL}/Sports/GetStaffs`
    ); // Change to the correct endpoint
    if (!response.ok) {
      throw new Error("Failed to fetch staff data"); // Handle errors if the request fails
    }
    const data: Staff[] = await response.json(); // Parse the JSON response
    return data; // Return the actual data
  }
);

// Async thunk for adding a new staff
export const addStaffAsync = createAsyncThunk<Staff, NewStaffPayload>(
  "Staff/addStaffAsync",
  async (newStaffData) => {
    const requestOptions: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(newStaffData),
    };

    const response = await fetch(
      `${process.env.API_BASE_URL}/Sports/InsertStaff`,
      requestOptions
    );

    // Handle the response
    if (!response.ok) {
      throw new Error("Failed to add staff");
    }

    const data = await response.json();
    return data;
  }
);

// Create the slice
const StaffsSlice = createSlice({
  name: "Staff",
  initialState,
  reducers: {
    // Existing reducers remain unchanged
    updateStaff: (state, action: PayloadAction<Staff>) => {
      const { id, title, description } = action.payload;
      const staffIndex = state.data.findIndex((staff) => staff.id === id);
      if (staffIndex !== -1) {
        state.data[staffIndex].title = title;
        state.data[staffIndex].description = description;
      }
    },
    deleteStaff: (state, action: PayloadAction<number>) => {
      const staffId = action.payload;
      state.data = state.data.filter((staff) => staff.id !== staffId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaffsAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchStaffsAsync.fulfilled,
        (state, action: PayloadAction<Staff[]>) => {
          state.isLoading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchStaffsAsync.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(addStaffAsync.pending, (state) => {
        state.isLoading = true; // Optionally, you can show loading while adding
      })
      .addCase(
        addStaffAsync.fulfilled,
        (state, action: PayloadAction<Staff>) => {
          state.isLoading = false;
          state.data.push(action.payload); // Add the new staff to the state
        }
      )
      .addCase(addStaffAsync.rejected, (state) => {
        state.isLoading = false; // Handle any error that occurs during addition
      });
  },
});

// Export the actions
export const { updateStaff, deleteStaff } = StaffsSlice.actions;
export default StaffsSlice.reducer;
