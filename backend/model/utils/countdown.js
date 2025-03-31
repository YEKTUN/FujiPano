const mongoose = require("mongoose");

const countdownSchema = new mongoose.Schema(
  {
    panoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pano",
      required: true,
    },
    message: {
      type: String,
    },
    remainingMinutes: {
      type: Number,
      default: 0,
    },
    XCoordinate: {
      type: Number,
    },
    YCoordinate: {
      type: Number,
    },
  },

  { timestamps: true }
);
module.exports = mongoose.model("Countdown", countdownSchema);
