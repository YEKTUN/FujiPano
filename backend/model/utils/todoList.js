const mongoose = require("mongoose");

const todoListSchema = new mongoose.Schema(
  {
    panoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pano",
      required: true,
    },
    todoItems: [
      {
        todo: { type: String, required: true }, 
        currentHour: { type: String, required: true }, 
      },
    ],
    XCoordinate: {
      type: Number,
      required: true,
    },
    YCoordinate: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TodoList", todoListSchema);
