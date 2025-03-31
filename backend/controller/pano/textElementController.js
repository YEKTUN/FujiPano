const TextElement = require("../../model/utils/textElement");
const Pano = require("../../model/panoModel");
const mongoose = require("mongoose");
const createTextElement = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { panoId } = req.params;
    const { text, XCoordinate, YCoordinate, fontSize, fontColor, fontFamily } =
      req.body;

    if (!panoId || !text) {
      return res
        .status(400)
        .json({ message: "Eksik bilgiler: panoId ve text gereklidir!" });
    }

    const pano = await Pano.findById(panoId).session(session);
    if (!pano) {
      return res.status(404).json({ error: "Pano bulunamadı!" });
    }

    const newTextElement = await TextElement.create(
      [
        {
          panoId,
          text,
          XCoordinate,
          YCoordinate,
          fontSize,
          fontColor,
          fontFamily,
        },
      ],
      { session }
    );

    console.log("✅ Yeni Metin Öğesi Kaydedildi:", newTextElement[0]);

    if (!pano.textElements) {
      pano.textElements = [];
    }
    pano.textElements.push(newTextElement[0]._id);
    await pano.save({ session });

    await session.commitTransaction();
    session.endSession();

    res
      .status(201)
      .json({
        message: "Metin öğesi başarıyla oluşturuldu!",
        data: newTextElement[0],
      });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("❌ Metin öğesi oluşturma hatası:", error.stack);
    res.status(500).json({ message: "❌ Sunucu hatası", error: error.message });
  }
};
const updateTextElement = async (req, res) => {
  try {
    const { textElementId } = req.params;
    const { text, XCoordinate, YCoordinate, fontSize, fontColor, fontFamily } =
      req.body;

    const updatedTextElement = await TextElement.findByIdAndUpdate(
      textElementId,
      { text, XCoordinate, YCoordinate, fontSize, fontColor, fontFamily },
      { new: true }
    );

    if (!updatedTextElement) {
      return res.status(404).json({ message: "Text element not found" });
    }

    res
      .status(200)
      .json({
        message: "Text element updated successfully",
        data: updatedTextElement,
      });
  } catch (error) {
    console.error("Error updating text element:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const deleteTextElement = async (req, res) => {
  try {
    const { textElementId } = req.params;

    const deletedTextElement = await TextElement.findByIdAndDelete(
      textElementId
    );

    if (!deletedTextElement) {
      return res.status(404).json({ message: "Text element not found" });
    }

    await Pano.updateMany(
      { textElements: textElementId },
      { $pull: { textElements: textElementId } }
    );

    res.status(200).json({ message: "Text element deleted successfully" });
  } catch (error) {
    console.error("Error deleting text element:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getTextElements = async (req, res) => {
  try {
    const { panoId } = req.params;

    const textElements = await TextElement.find({ panoId });

    res
      .status(200)
      .json({
        message: "Text elements fetched successfully",
        data: textElements,
      });
  } catch (error) {
    console.error("Error fetching text elements:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createTextElement,
  updateTextElement,
  deleteTextElement,
  getTextElements,
};
