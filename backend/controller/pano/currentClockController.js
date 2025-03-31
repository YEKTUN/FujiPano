const CurrentClock = require("../../model/utils/currentClock");
const Pano = require("../../model/panoModel");
const mongoose = require("mongoose");

const createClock = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { panoId } = req.params;
    const { XCoordinate, YCoordinate, fontSize, fontColor, fontFamily } =
      req.body;

    if (!panoId) {
      return res.status(400).json({ message: "panoId is required" });
    }

    const pano = await Pano.findById(panoId).session(session);
    if (!pano) {
      return res.status(404).json({ error: "Pano bulunamadı!" });
    }

    const now = new Date();
    const days = [
      "Pazar",
      "Pazartesi",
      "Salı",
      "Çarşamba",
      "Perşembe",
      "Cuma",
      "Cumartesi",
    ];
    const dayOfWeek = days[now.getDay()];
    const formattedTime = `${dayOfWeek} - ${now
      .getDate()
      .toString()
      .padStart(2, "0")}/${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${now.getFullYear()} ${now
      .getHours()
      .toString()
      .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    const newClock = await CurrentClock.create(
      [
        {
          panoId,
          currentTime: formattedTime,
          XCoordinate,
          YCoordinate,
          fontSize,
          fontColor,
          fontFamily,
        },
      ],
      { session }
    );

    pano.currentClock.push(newClock[0]._id);
    await pano.save({ session });

    await session.commitTransaction();
    session.endSession();

    res
      .status(201)
      .json({ message: "Saat başarıyla oluşturuldu!", data: newClock[0] });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error creating clock:", error);
    res.status(500).json({ message: "Sunucu hatası", details: error.message });
  }
};

const updateCurrentClock = async (req, res) => {
  try {
    const { clockId } = req.params;
    const { XCoordinate, YCoordinate, fontSize, fontColor, fontFamily } =
      req.body;

    if (!clockId) {
      return res.status(400).json({ message: "clockId is required" });
    }

    const now = new Date();
    const days = [
      "Pazar",
      "Pazartesi",
      "Salı",
      "Çarşamba",
      "Perşembe",
      "Cuma",
      "Cumartesi",
    ];
    const dayOfWeek = days[now.getDay()];
    const formattedTime = `${dayOfWeek} - ${now
      .getDate()
      .toString()
      .padStart(2, "0")}/${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${now.getFullYear()} ${now
      .getHours()
      .toString()
      .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    const updatedClock = await CurrentClock.findByIdAndUpdate(
      clockId,
      {
        currentTime: formattedTime,
        XCoordinate,
        YCoordinate,
        fontSize,
        fontColor,
        fontFamily,
      },
      { new: true }
    );

    if (!updatedClock) {
      return res.status(404).json({ message: "Clock not found" });
    }

    res
      .status(200)
      .json({ message: "Clock updated successfully", data: updatedClock });
  } catch (error) {
    console.error("Error updating clock:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCurrentClock = async (req, res) => {
  try {
    const { panoId } = req.params;

    if (!panoId) {
      return res.status(400).json({ message: "panoId is required" });
    }

    const currentClocks = await CurrentClock.find({ panoId });
    console.log(currentClocks);

    res
      .status(200)
      .json({ message: "Clocks fetched successfully", data: currentClocks });
  } catch (error) {
    console.error("Error fetching clocks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const deleteCurrentClock = async (req, res) => {
  try {
    const { clockId } = req.params;

    if (!clockId) {
      return res.status(400).json({ message: "clockId is required" });
    }

    const deletedClock = await CurrentClock.findByIdAndDelete(clockId);

    // if (!deletedClock) {
    //   return res.status(404).json({ message: "Clock not found" });
    // }

    await Pano.updateMany(
      { currentClock: clockId },
      { $pull: { currentClock: clockId } }
    );

    res.status(200).json({ message: "Clock deleted successfully" });
  } catch (error) {
    console.error("Error deleting clock:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  createClock,
  updateCurrentClock,
  getCurrentClock,
  deleteCurrentClock,
};
