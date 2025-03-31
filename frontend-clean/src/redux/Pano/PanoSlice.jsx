import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../Url";

export const getPanos = createAsyncThunk(
  "pano/getPanos",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/pano/get-panos/${userId}`);
      return response.data.panos;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch panos");
    }
  }
);

export const createPano = createAsyncThunk(
  "pano/createPano",
  async ({ userId, panoName }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/pano/create-pano`, {
        userId,
        panoName,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create pano");
    }
  }
);

export const deletePano = createAsyncThunk(
  "pano/deletePano",
  async (panoId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/pano/delete-pano/${panoId}`);
      return panoId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete pano");
    }
  }
);

const PanoSlice = createSlice({
  name: "pano",
  initialState: {
    panos: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPanos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPanos.fulfilled, (state, action) => {
        state.loading = false;
        state.panos = action.payload;
      })
      .addCase(getPanos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createPano.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPano.fulfilled, (state, action) => {
        state.loading = false;
        state.panos.push(action.payload.pano);
      })
      .addCase(createPano.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deletePano.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePano.fulfilled, (state, action) => {
        state.loading = false;
        state.panos = state.panos.filter((pano) => pano._id !== action.payload);
      })
      .addCase(deletePano.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default PanoSlice.reducer;
