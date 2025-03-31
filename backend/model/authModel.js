const mongoose = require("mongoose");



const authSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    pano: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pano",
      },
    ],
    membership:{
      type: String,
      default: "Free"
    },
    membershipExpireDate:{
      type: Date,
    }

  },

  { timestamps: true }
);
module.exports = mongoose.model("Auth", authSchema);
