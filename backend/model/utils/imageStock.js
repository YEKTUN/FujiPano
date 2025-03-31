const mongoose = require("mongoose");

const imageStockSchema = new mongoose.Schema(
  {
    panoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pano",
      required: true,
    },
  imageUrl:{
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

module.exports = mongoose.model("ImageStock", imageStockSchema);
