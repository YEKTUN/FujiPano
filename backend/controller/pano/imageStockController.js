const ImageStock = require("../../model/utils/imageStock");
const upload = require("../../middleware/multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const Pano = require("../../model/panoModel");
const mongoose = require("mongoose");

const uploadImage = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log("✅ API Çağrıldı - uploadImage");
    console.log("📌 Gelen Dosya Bilgisi:", req.file);
    console.log("📌 Gelen Body:", req.body);

    const { panoId } = req.params;
    const { XCoordinate, YCoordinate } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({
          message: "❌ Dosya yüklenemedi. Lütfen geçerli bir dosya yükleyin.",
        });
    }

    const pano = await Pano.findById(panoId).session(session);
    if (!pano) {
      return res.status(404).json({ error: "Pano bulunamadı!" });
    }

    const filePath = req.file.path;
    console.log("📌 Yüklenecek Dosya Path:", filePath);

    const result = await cloudinary.uploader
      .upload(filePath, {
        folder: "PanoWebsite/Photo",
      })
      .catch((error) => {
        console.error("❌ Cloudinary Hata:", error.message);
        throw new Error("Cloudinary'ye yükleme başarısız.");
      });

    console.log("✅ Cloudinary Yükleme Başarılı:", result.secure_url);

    const imageUrl = result.secure_url;

    const newImage = await ImageStock.create(
      [{ panoId, imageUrl, XCoordinate, YCoordinate }],
      { session }
    );

    console.log("✅ MongoDB Kaydedildi:", newImage[0]);

    pano.imageUrl.push(newImage[0].imageUrl);
    await pano.save({ session });

    fs.unlinkSync(filePath);
    console.log("✅ Geçici Dosya Silindi:", filePath);

    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json({ message: "✅ Resim başarıyla yüklendi", data: newImage[0] });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("❌ Resim yükleme hatası:", error.stack);
    res.status(500).json({ message: "❌ Sunucu hatası", error: error.message });
  }
};
const getImages = async (req, res) => {
  try {
    const { panoId } = req.params;
    const images = await ImageStock.find({ panoId });
    res
      .status(200)
      .json({ message: "Images fetched successfully", data: images });
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const deleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    const deletedImage = await ImageStock.findByIdAndDelete(imageId);

    if (!deletedImage) {
      return res.status(404).json({ message: "Image not found" });
    }

    await Pano.updateMany(
      { imageUrl: deletedImage.imageUrl },
      { $pull: { imageUrl: deletedImage.imageUrl } }
    );

    return res.status(200).json({
      message: "Image deleted successfully",
      data: deletedImage,
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const updateImagePosition = async (req, res) => {
  try {
    const { imageId } = req.params;
    const { XCoordinate, YCoordinate } = req.body;

    const updatedImage = await ImageStock.findByIdAndUpdate(
      imageId,
      { XCoordinate, YCoordinate },
      { new: true }
    );

    if (!updatedImage) {
      return res.status(404).json({ message: "Image not found" });
    }

    res
      .status(200)
      .json({
        message: "Image position updated successfully",
        data: updatedImage,
      });
  } catch (error) {
    console.error("Error updating image position:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { uploadImage, getImages, deleteImage, updateImagePosition };
