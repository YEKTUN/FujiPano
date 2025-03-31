import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { API_URL } from '../../Url'
import axios from 'axios'


export const createClock = createAsyncThunk(
  "currentClock/create",
  async ({ panoId, XCoordinate, YCoordinate }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/pano/current-clock/create/${panoId}`, { XCoordinate, YCoordinate });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCurrentClock = createAsyncThunk(
  "currentClock/update",
  async ({ clockId, XCoordinate, YCoordinate, fontSize, fontColor, fontFamily }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/pano/current-clock/update/${clockId}`, { XCoordinate, YCoordinate, fontSize, fontColor, fontFamily });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getCurrentClock = createAsyncThunk(
  "currentClock/get",
  async (panoId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/pano/current-clock/get/${panoId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCurrentClock = createAsyncThunk(
  "currentClock/delete",
  async (clockId, { rejectWithValue }) => {
    try {
     const response= await axios.delete(`${API_URL}/pano/current-clock/delete/${clockId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  clocks:[],
  loading: false,
  error: null,
}

export const CurrentClockSlice = createSlice({
  name: 'CurrentClock',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(createClock.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createClock.fulfilled, (state, action) => {
     
      // state.loading = false;
      // if (action.payload && action.payload.data) {
      //   state.clocks = [...state.clocks, action.payload.data]; // Önceki listeyi koruyarak yeni saat ekle
      // }
      console.log("✅ Saat Eklendi Redux State:", state.clocks);
    })
    .addCase(createClock.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(getCurrentClock.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getCurrentClock.fulfilled, (state, action) => {
      state.loading = false;
     
      // state.clocks = Array.isArray(action.payload.data) ? action.payload.data : [];
      state.clocks=action.payload.data
      console.log("✅ Redux getCurrentClock Güncellenmiş State:", action.payload.data);
    })
    
    .addCase(getCurrentClock.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      console.log(action.payload);
      
    })
    .addCase(updateCurrentClock.pending, (state) => {
      state.loading = true;
      state.error = null;
      console.log("loading");
    })
    .addCase(updateCurrentClock.fulfilled, (state, action) => {
      state.loading = false;
      const updatedClock = action.payload.data;
      
      const index = state.clocks.findIndex(clock => clock._id === updatedClock._id);
      if (index !== -1) {
        state.clocks[index] = updatedClock;
      }
    
      console.log("📌 Güncellenmiş Redux State (updateCurrentClock):", state.clocks);
    })
    .addCase(updateCurrentClock.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      console.log("📌 updateCurrentClock  state.error:", state.error);
    })
    .addCase(deleteCurrentClock.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteCurrentClock.fulfilled, (state, action) => {
    
      // state.loading = false;
      // state.clocks = state.clocks.filter(clock => clock._id !== action.payload);
    })
    .addCase(deleteCurrentClock.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
})


export const { } = CurrentClockSlice.actions

export default CurrentClockSlice.reducer