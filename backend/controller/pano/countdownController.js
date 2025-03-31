const mongoose = require("mongoose");
const Countdown = require("../../model/utils/countdown");
const Pano = require("../../model/panoModel");

const createCountdown = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { panoId } = req.params;
    const { message, remainingMinutes, XCoordinate, YCoordinate } = req.body;

    if (!panoId || !message || remainingMinutes == null) {
      return res
        .status(400)
        .json({
          error: "Eksik bilgiler: panoId, message veya remainingMinutes eksik!",
        });
    }

    const pano = await Pano.findById(panoId).session(session);
    if (!pano) {
      return res.status(404).json({ error: "Pano bulunamadı!" });
    }

    const newCountdown = await Countdown.create(
      [
        {
          panoId,
          message,
          remainingMinutes,
          XCoordinate,
          YCoordinate,
        },
      ],
      { session }
    );

    pano.countdown.push(newCountdown[0]._id);
    await pano.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Sayaç (Countdown) başarıyla oluşturuldu!",
      countdown: newCountdown[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating countdown:", error);
    return res.status(500).json({
      message: "Sunucu hatası",
      details: error.message,
    });
  }
};

const updateCountdown = async (req, res) => {
  try {
    const { countdownId } = req.params;

    const { message, remainingMinutes, XCoordinate, YCoordinate } = req.body;

    const updatedCountdown = await Countdown.findByIdAndUpdate(
      countdownId,
      {
        message,
        remainingMinutes,
        XCoordinate,
        YCoordinate,
      },
      { new: true }
    );

    if (!updatedCountdown) {
      return res.status(404).json({ message: "Countdown not found" });
    }

    return res.status(200).json({
      message: "Countdown updated successfully",
      data: updatedCountdown,
    });
  } catch (error) {
    console.error("Error updating countdown:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteCountdown = async (req, res) => {
  try {
    const { countdownId } = req.params;

    const deletedCountdown = await Countdown.findByIdAndDelete(countdownId);
    if (!deletedCountdown) {
      return res.status(404).json({ message: "Countdown not found" });
    }

    await Pano.findByIdAndUpdate(deletedCountdown.panoId, {
      $pull: { countdown: countdownId },
    });

    return res.status(200).json({ message: "Countdown deleted successfully" });
  } catch (error) {
    console.error("Error deleting countdown:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getCountdowns = async (req, res) => {
  try {
    const { panoId } = req.params;

    const countdowns = await Countdown.find({ panoId });

    return res.status(200).json({
      message: "Countdowns fetched successfully",
      data: countdowns,
    });
  } catch (error) {
    console.error("Error fetching countdowns:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createCountdown,
  updateCountdown,
  deleteCountdown,
  getCountdowns,
};
