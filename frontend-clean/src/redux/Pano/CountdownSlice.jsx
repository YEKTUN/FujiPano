import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_URL } from "../../Url";
import axios from "axios";

export const createCountdown = createAsyncThunk(
  "countdown/create",
  async (
    { panoId, message, remainingMinutes, XCoordinate, YCoordinate },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${API_URL}/pano/countdown/create/${panoId}`,
        { message, remainingMinutes, XCoordinate, YCoordinate }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getCountdowns = createAsyncThunk(
  "countdown/get",
  async (panoId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/pano/countdown/get/${panoId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCountdown = createAsyncThunk(
  "countdown/update",
  async (
    { countdownId, message, remainingMinutes, XCoordinate, YCoordinate },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${API_URL}/pano/countdown/update/${countdownId}`,
        { message, remainingMinutes, XCoordinate, YCoordinate }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCountdown = createAsyncThunk(
  "countdown/delete",
  async (countdownId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/pano/countdown/delete/${countdownId}`);
      return countdownId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  countdowns: [],
  loading: false,
  error: null,
};

export const CountdownSlice = createSlice({
  name: "Countdown",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(createCountdown.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCountdown.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.data) {
          state.countdowns = [...state.countdowns, action.payload.data];
        }
      })
      .addCase(createCountdown.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getCountdowns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCountdowns.fulfilled, (state, action) => {
        state.loading = false;
        state.countdowns = Array.isArray(action.payload.data)
          ? action.payload.data
          : [];
      })
      .addCase(getCountdowns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateCountdown.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCountdown.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.countdowns.findIndex(
          (countdown) => countdown._id === action.payload.data._id
        );
        if (index !== -1) {
          state.countdowns[index] = action.payload.data;
        }
      })
      .addCase(updateCountdown.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteCountdown.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCountdown.fulfilled, (state, action) => {
        state.loading = false;
        state.countdowns = state.countdowns.filter(
          (countdown) => countdown._id !== action.payload
        );
      })
      .addCase(deleteCountdown.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default CountdownSlice.reducer;
