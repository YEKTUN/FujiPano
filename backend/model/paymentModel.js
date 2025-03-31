const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  conversationId: {
    type: String,
    required: true,
  }, 
  paymentId: {
    type: String,
    unique: true,
  }, 
  status: {
    type: String,
    required: true,
  }, 
  price: {
    type: Number,
    required: true,
  }, 
  currency: {
    type: String,
    default: "TRY",
  }, 
  cardHolderName: {
    type: String,
    required: true,
  }, 
  createdAt: {
    type: Date,
    default: Date.now,
  }, 
});

module.exports = mongoose.model("Payment", PaymentSchema);
