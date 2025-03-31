const Auth = require("../../model/authModel");
const Pano = require("../../model/panoModel");
const mongoose = require("mongoose");
const CurrentClock = require("../../model/utils/currentClock");
const Countdown = require("../../model/utils/countdown");
const MarkedCalendar = require("../../model/utils/markedCalender");
const TodoList = require("../../model/utils/todoList");
const TextElement = require("../../model/utils/textElement");
const ImageStock = require("../../model/utils/imageStock");
const VideoStock = require("../../model/utils/videoStock");
const createPano = async (req, res) => {
  try {
    const { userId, panoName } = req.body;

    if (!userId || !panoName || panoName.trim() === "") {
      return res
        .status(400)
        .json({ error: "Eksik bilgiler: userId veya panoName eksik!" });
    }

    const user = await Auth.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingPano = await Pano.findOne({ userId, panoName });
    if (existingPano) {
      return res
        .status(400)
        .json({ error: "A pano with this name already exists." });
    }

    const pano = await Pano.create({ userId, panoName });

    user.pano.push(pano._id);
    await user.save();

    res.status(201).json({ message: "Pano created successfully!", pano });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
const deletePano = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { panoId } = req.params;

    const pano = await Pano.findById(panoId).session(session);
    if (!pano) {
      return res.status(404).json({ error: "Pano bulunamadı!" });
    }

    await Auth.findByIdAndUpdate(pano.userId, {
      $pull: { pano: panoId },
    }).session(session);

    await CurrentClock.deleteMany({ _id: { $in: pano.currentClock } }).session(
      session
    );
    await Countdown.deleteMany({ _id: { $in: pano.countdown } }).session(
      session
    );
    await MarkedCalendar.deleteMany({
      _id: { $in: pano.markedCalendar },
    }).session(session);
    await TodoList.deleteMany({ _id: { $in: pano.todoList } }).session(session);
    await TextElement.deleteMany({ _id: { $in: pano.textElements } }).session(
      session
    );

    const images = await ImageStock.find({
      _id: { $in: pano.imageUrl },
    }).session(session);
    for (let img of images) {
      await cloudinary.uploader.destroy(img.imageUrl);
    }
    await ImageStock.deleteMany({ _id: { $in: pano.imageUrl } }).session(
      session
    );

    const videos = await VideoStock.find({
      _id: { $in: pano.videoUrl },
    }).session(session);
    for (let vid of videos) {
      await cloudinary.uploader.destroy(vid.videoUrl, {
        resource_type: "video",
      });
    }
    await VideoStock.deleteMany({ _id: { $in: pano.videoUrl } }).session(
      session
    );

    await Pano.findByIdAndDelete(panoId).session(session);

    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json({ message: "✅ Pano ve bağlı tüm öğeler başarıyla silindi!" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("❌ Pano silme hatası:", error.stack);
    res.status(500).json({ message: "❌ Sunucu hatası", error: error.message });
  }
};
const getPanos = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await Auth.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const panos = await Pano.find({ userId });

    if (panos.length === 0) {
      return res.status(404).json({ message: "No panos found for this user" });
    }

    res.status(200).json({ panos });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

module.exports = { createPano, deletePano, getPanos };
