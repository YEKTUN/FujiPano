import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../Url";

const initialState = {
  paymentData: null,
  paymentStatus: "idle",
  paymentError: null,

  paymentDetail: null,
  paymentDetailStatus: "idle",
  paymentDetailError: null,

  threeDPaymentData: null,
  threeDPaymentStatus: "idle",
  threeDPaymentError: null,
};

export const createPayment = createAsyncThunk(
  "payment/createPayment",
  async (paymentInfo, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/payment/create-payment`,
        paymentInfo
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Bir hata oluştu");
    }
  }
);

export const getPayment = createAsyncThunk(
  "payment/getPayment",
  async (paymentId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/payment/get-payment`, {
        paymentId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Bir hata oluştu");
    }
  }
);

export const start3DPayment = createAsyncThunk(
  "payment/start3DPayment",
  async (paymentInfo, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/payment/start-3d-payment`,
        paymentInfo
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Bir hata oluştu");
    }
  }
);

export const complete3DPayment = createAsyncThunk(
  "payment/complete3DPayment",
  async (paymentInfo, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/payment/complete-3d-payment`,
        paymentInfo
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Bir hata oluştu");
    }
  }
);

const PaymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPayment.pending, (state) => {
        state.paymentStatus = "loading";
        state.paymentError = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.paymentStatus = "succeeded";
        state.paymentData = action.payload;
        localStorage.setItem("membership", state.paymentData.newToken);
        console.log(
          "✅ Redux createPayment Güncellenmiş State:",
          state.paymentData
        );
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.paymentStatus = "failed";
        state.paymentError = action.payload;
        console.error("❌ Redux createPayment hatası:", state.paymentError);
      })

      .addCase(getPayment.pending, (state) => {
        state.paymentDetailStatus = "loading";
        state.paymentDetailError = null;
      })
      .addCase(getPayment.fulfilled, (state, action) => {
        state.paymentDetailStatus = "succeeded";
        state.paymentDetail = action.payload;
      })
      .addCase(getPayment.rejected, (state, action) => {
        state.paymentDetailStatus = "failed";
        state.paymentDetailError = action.payload;
      })

      .addCase(start3DPayment.pending, (state) => {
        state.threeDPaymentStatus = "loading";
        state.threeDPaymentError = null;
      })
      .addCase(start3DPayment.fulfilled, (state, action) => {
        state.threeDPaymentStatus = "succeeded";
        state.threeDPaymentData = action.payload;
        console.log("3D Secure Payment Data:", state.threeDPaymentData);
      })
      .addCase(start3DPayment.rejected, (state, action) => {
        state.threeDPaymentStatus = "failed";
        state.threeDPaymentError = action.payload;
        console.error("3D Secure Payment Error:", state.threeDPaymentError);
      })

      .addCase(complete3DPayment.pending, (state) => {
        state.threeDPaymentStatus = "loading";
      })
      .addCase(complete3DPayment.fulfilled, (state, action) => {
        state.threeDPaymentStatus = "succeeded";
        state.threeDPaymentData = action.payload;
      })
      .addCase(complete3DPayment.rejected, (state, action) => {
        state.threeDPaymentStatus = "failed";
        state.threeDPaymentError = action.payload;
      });
  },
});

export default PaymentSlice.reducer;
