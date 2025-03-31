const mongoose = require("mongoose");

const textElementSchema = new mongoose.Schema(
  {
    panoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pano",
      required: true,
    },
  text:{
    type: String,
    
  },
    XCoordinate: {
      type: Number,
      
    },
    YCoordinate: {
      type: Number,
      
    },
    fontSize: {
      type: Number,
      default: 16, 
    },
    fontColor: {
      type: String,
      default: "#000000", 
    },
    fontFamily: {
      type: String,
      default: "Arial",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TextElement", textElementSchema);
