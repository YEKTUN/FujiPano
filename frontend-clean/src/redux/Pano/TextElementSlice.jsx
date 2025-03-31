import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_URL } from "../../Url";
import axios from "axios";

export const createTextElement = createAsyncThunk(
  "textElement/create",
  async ({ panoId, text, XCoordinate, YCoordinate }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/pano/text-element/create/${panoId}`,
        {
          text,
          XCoordinate,
          YCoordinate,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getTextElements = createAsyncThunk(
  "textElement/get",
  async (panoId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/pano/text-element/get/${panoId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateTextElement = createAsyncThunk(
  "textElement/update",
  async (
    {
      textElementId,
      text,
      XCoordinate,
      YCoordinate,
      fontSize,
      fontColor,
      fontFamily,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${API_URL}/pano/text-element/update/${textElementId}`,
        {
          text,
          XCoordinate,
          YCoordinate,
          fontSize,
          fontColor,
          fontFamily,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteTextElement = createAsyncThunk(
  "textElement/delete",
  async (textElementId, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${API_URL}/pano/text-element/delete/${textElementId}`
      );
      return textElementId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  textElements: [],
  loading: false,
  error: null,
};

export const TextElementSlice = createSlice({
  name: "TextElement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(createTextElement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTextElement.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.data) {
          state.textElements = [...state.textElements, action.payload.data];
        }
      })
      .addCase(createTextElement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getTextElements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTextElements.fulfilled, (state, action) => {
        state.loading = false;
        state.textElements = Array.isArray(action.payload.data)
          ? action.payload.data
          : [];
      })
      .addCase(getTextElements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateTextElement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTextElement.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.textElements.findIndex(
          (element) => element._id === action.payload.data._id
        );
        if (index !== -1) {
          state.textElements[index] = action.payload.data;
        }
      })
      .addCase(updateTextElement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteTextElement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTextElement.fulfilled, (state, action) => {
        state.loading = false;
        state.textElements = state.textElements.filter(
          (element) => element._id !== action.payload
        );
      })
      .addCase(deleteTextElement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default TextElementSlice.reducer;
