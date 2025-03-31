import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../../Url";
import axios from "axios";


export const uploadImage = createAsyncThunk(
  "imageStock/upload",
  async ({ panoId, imageFile, XCoordinate, YCoordinate }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("XCoordinate", XCoordinate);
      formData.append("YCoordinate", YCoordinate);

      const response = await axios.post(
        `${API_URL}/pano/image-stock/upload/${panoId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const getImages = createAsyncThunk(
  "imageStock/get",
  async (panoId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/pano/image-stock/get/${panoId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const deleteImage = createAsyncThunk(
  "imageStock/delete",
  async (imageId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/pano/image-stock/delete/${imageId}`);
      return response.data.data._id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const updateImagePosition = createAsyncThunk(
  "imageStock/updatePosition",
  async ({ imageId, XCoordinate, YCoordinate }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/pano/image-stock/update-position/${imageId}`,
        { XCoordinate, YCoordinate }
      );
     
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const initialState = {
  images: [],
  loading: false,
  error: null,
};


export const ImageStockSlice = createSlice({
  name: "ImageStock",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(updateImagePosition.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateImagePosition.fulfilled, (state, action) => {
      state.loading = false;
      const updatedData = action.payload.data; 
      if (updatedData && updatedData._id) {
       
        const index = state.images.findIndex((img) => img._id === updatedData._id);
        if (index !== -1) {
          state.images[index] = updatedData;
        }
      }
    })
    .addCase(updateImagePosition.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
     
      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.data) {
          state.images.push(action.payload.data);
        }
       
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        
      })

  
      .addCase(getImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = Array.isArray(action.payload.data) ? action.payload.data : [];
        
      })
      .addCase(getImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

     
      .addCase(deleteImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.loading = false;
        state.images = state.images.filter((image) => image._id !== action.payload);
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export default ImageStockSlice.reducer;
