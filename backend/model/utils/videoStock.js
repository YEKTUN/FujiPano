const mongoose = require("mongoose");

const videoStockSchema = new mongoose.Schema(
  {
    panoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pano",
      required: true,
    },
  videoUrl:{
    type: String,
    
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

module.exports = mongoose.model("VideoStock", videoStockSchema);
