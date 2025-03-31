import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../../Url";
import axios from "axios";

export const uploadVideo = createAsyncThunk(
  "videoStock/upload",
  async (
    { panoId, videoFile, XCoordinate, YCoordinate },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("video", videoFile);
      formData.append("XCoordinate", XCoordinate);
      formData.append("YCoordinate", YCoordinate);

      const response = await axios.post(
        `${API_URL}/pano/video-stock/upload/${panoId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getVideos = createAsyncThunk(
  "videoStock/get",
  async (panoId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/pano/video-stock/get/${panoId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteVideo = createAsyncThunk(
  "videoStock/delete",
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/pano/video-stock/delete/${videoId}`
      );
      return response.data.data._id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const updateVideoPosition = createAsyncThunk(
  "videoStock/updatePosition",
  async ({ videoId, XCoordinate, YCoordinate }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/pano/video-stock/update-position/${videoId}`,
        { XCoordinate, YCoordinate }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  videos: [],
  loading: false,
  error: null,
};

export const VideoStockSlice = createSlice({
  name: "VideoStock",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateVideoPosition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVideoPosition.fulfilled, (state, action) => {
        state.loading = false;
        const updatedData = action.payload.data;
        if (updatedData && updatedData._id) {
          const index = state.videos.findIndex(
            (vid) => vid._id === updatedData._id
          );
          if (index !== -1) {
            state.videos[index] = updatedData;
          }
        }
      })
      .addCase(updateVideoPosition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(uploadVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadVideo.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.data) {
          state.videos.push(action.payload.data);
        }
      })
      .addCase(uploadVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("❌ Video yükleme hatası:", action.payload);
      })

      .addCase(getVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = Array.isArray(action.payload.data)
          ? action.payload.data
          : [];
      })
      .addCase(getVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = state.videos.filter(
          (video) => video._id !== action.payload
        );
      })
      .addCase(deleteVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default VideoStockSlice.reducer;
