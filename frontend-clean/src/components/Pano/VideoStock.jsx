import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteVideo, getVideos } from "../../redux/Pano/VideoStockSlice";

const VideoStock = ({ video, panoId }) => {
  const dispatch = useDispatch();

  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = (event) => {
    event.preventDefault();

    setContextMenu({ x: event.clientX, y: event.clientY });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteVideo(video._id)).unwrap();

      await dispatch(getVideos(panoId));
    } catch (error) {
      console.error("❌ Video silinirken hata:", error);
    }
    handleCloseContextMenu();
  };

  return (
    <div
      style={{
        left: video.XCoordinate,
        top: video.YCoordinate,
      }}
      onContextMenu={handleContextMenu}
      onClick={handleCloseContextMenu}
    >
      <video
        src={video.videoUrl}
        style={{
          width: 300,
          height: 200,
        }}
        controls
      />

      {contextMenu && (
        <div
          className="bg-white shadow-lg border rounded-md p-2 z-10"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
          }}
        >
          <button
            className="block w-full px-4 py-2 text-left hover:bg-gray-200"
            onClick={handleDelete}
          >
            🗑️ Sil
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoStock;
