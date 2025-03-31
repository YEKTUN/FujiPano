const VideoStock = require("../../model/utils/videoStock");
const upload = require("../../middleware/multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const mongoose = require("mongoose");
const Pano=require("../../model/panoModel")

const uploadVideo = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction(); 

    try {
        console.log("✅ API Çağrıldı - uploadVideo");
        console.log("📌 Gelen Dosya Bilgisi:", req.file);
        console.log("📌 Gelen Body:", req.body);

        const { panoId } = req.params;
        const { XCoordinate, YCoordinate } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "❌ Video yüklenemedi. Lütfen geçerli bir dosya yükleyin." });
        }

       
        const pano = await Pano.findById(panoId).session(session);
        if (!pano) {
            return res.status(404).json({ error: "Pano bulunamadı!" });
        }

        const filePath = req.file.path;
        console.log("📌 Yüklenecek Video Path:", filePath);

      
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "video",
            folder: "PanoWebsite/Video",
        }).catch(error => {
            console.error("❌ Cloudinary Hata:", error.message);
            throw new Error("Cloudinary'ye video yükleme başarısız.");
        });

        console.log("✅ Cloudinary Video Yükleme Başarılı:", result.secure_url);

        
        const videoUrl = result.secure_url;

       
        const newVideo = await VideoStock.create([{ panoId, videoUrl, XCoordinate, YCoordinate }], { session });

        console.log("✅ MongoDB Kaydedildi:", newVideo[0]);

        
        if (!pano.videoUrl) {
            pano.videoUrl = [];
        }
        pano.videoUrl.push(newVideo[0].videoUrl);
        await pano.save({ session });

       
        fs.unlinkSync(filePath);
        console.log("✅ Geçici Dosya Silindi:", filePath);

        await session.commitTransaction(); 
        session.endSession();

        res.status(200).json({ message: "✅ Video başarıyla yüklendi", data: newVideo[0] });

    } catch (error) {
        await session.abortTransaction(); 
        session.endSession();

        console.error("❌ Video yükleme hatası:", error.stack);
        res.status(500).json({ message: "❌ Sunucu hatası", error: error.message });
    }
};

const getVideos = async (req, res) => {
    try {
        const { panoId } = req.params;
        const videos = await VideoStock.find({ panoId });
        res.status(200).json({ message: "Videos fetched successfully", data: videos });
    } catch (error) {
        console.error("Error fetching videos:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteVideo = async (req, res) => {
    try {
      const { videoId } = req.params;
  
  
      const deletedVideo = await VideoStock.findByIdAndDelete(videoId);
      if (!deletedVideo) {
        return res.status(404).json({ message: "Video not found" });
      }
  
 
      await Pano.updateMany(
        { videoUrl: deletedVideo.videoUrl },
        { $pull: { videoUrl: deletedVideo.videoUrl } }
      );
      
      
      return res.status(200).json({
        message: "Video deleted successfully",
        data: deletedVideo,
      });
    } catch (error) {
      console.error("Error deleting video:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
const updateVideoPosition = async (req, res) => {
    try {
      
      const { videoId } = req.params;
      
      const { XCoordinate, YCoordinate } = req.body;
  
      
      const updatedVideo = await VideoStock.findByIdAndUpdate(
        videoId,
        { XCoordinate, YCoordinate },
        { new: true } 
      );
  
      if (!updatedVideo) {
        return res.status(404).json({ message: "Video not found" });
      }
  
      return res.status(200).json({
        message: "Video position updated successfully",
        data: updatedVideo,
      });
    } catch (error) {
      console.error("Error updating video position:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

module.exports = { uploadVideo, getVideos, deleteVideo, updateVideoPosition };
