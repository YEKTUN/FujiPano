const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  color: { type: String, default: "#3788d8" },
  start: { type: Date, required: true },
  end: { type: Date },
  allDay: { type: Boolean, default: true },
});

const calendarSchema = new mongoose.Schema(
  {
    panoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pano",
      required: true,
    },
    year: { type: Number, required: true },
    events: [eventSchema],
    XCoordinate: {
      type: Number,
    },
    YCoordinate: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Calendar", calendarSchema);
