
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteImage, getImages } from "../../redux/Pano/ImageStockSlice";

const ImageStock = ({ imageUrl, imageId, panoId }) => {
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
      await dispatch(deleteImage(imageId)).unwrap();
      
      await dispatch(getImages(panoId));
    } catch (error) {
      console.error("❌ Resim silinirken hata:", error);
    }
    handleCloseContextMenu();
  };

  return (
    <div
      className="relative"
      onContextMenu={handleContextMenu}
      onClick={handleCloseContextMenu}
    >
      <img
        className="w-full h-full rounded-xl"
        src={imageUrl}
        alt="stock"
      />

    
      {contextMenu && (
        <div
          className=" bg-white shadow-lg border rounded-md p-2 z-10"
          style={{ top: contextMenu.y, left: contextMenu.x }}
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

export default ImageStock;
