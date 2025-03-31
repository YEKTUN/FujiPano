import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateCurrentClock } from "../../redux/Pano/CurrentClockSlice";
import ClockEditModal from "./modal/ClockEditModal";
import { deleteCurrentClock, getCurrentClock } from "../../redux/Pano/CurrentClockSlice";


const Clock = ({ currentTime, clockId, panoId,fontSize,fontColor,fontFamily }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [clockColor, setClockColor] = useState("#ffffff"); 

  useEffect(() => {
    if (!clockId) {
      console.error("❌ clockId undefined! API çağrısı atılmadı.");
      return;
    }
  
    const interval = setInterval(() => {
      console.log("🕒 Güncellenen clockId:", clockId);
      dispatch(updateCurrentClock({ clockId })).catch((err) => {
        console.warn("⚠️ Güncelleme başarısız, saat silinmiş olabilir:", err);
      });
    }, 30000);
  
    return () => clearInterval(interval);
  }, [ dispatch]);

 
  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY });
  };

  
  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };
  const handleDelete = async () => {
    if (!panoId) {
      console.error("❌ panoId eksik!");
      return;
    }
  try {
    
    await dispatch(deleteCurrentClock(clockId)).unwrap();
    console.log("✅ Saat silindi, güncellenmiş saatler çekiliyor...");
    dispatch(getCurrentClock(panoId));
 
  } catch (error) {
    console.log("❌ Saat silinirken hata oluştu:", error);
    
  }
  
     
  };



  return (
    <div onContextMenu={handleContextMenu} onClick={handleCloseContextMenu} className="relative">
      <div className="text-xl font-bold cursor-pointer"   style={{
          color: fontColor,
          fontSize: `${fontSize}px`,
          fontFamily: fontFamily === "FontAwesome" ? '"Font Awesome 5 Free"' : fontFamily,
        }}>
        {currentTime}
      </div>

    
      {contextMenu && (
        <div
          className="bg-white shadow-lg border rounded-md p-2  z-10"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            className="block w-full px-4 py-2 text-left hover:bg-gray-200"
            onClick={() => {
              setIsModalOpen(true);
              handleCloseContextMenu();
            }}
          >
            ⚙️ Ayarlar
          </button>
          <button
            className="block w-full px-4 py-2 text-left hover:bg-gray-200"
            onClick={handleDelete}
          >
            🗑️ Sil
          </button>
        </div>
      )}

    
      {isModalOpen && (
        <ClockEditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          clockId={clockId}
          panoId={panoId}
          initialFontSize={fontSize}
          initialFontColor={fontColor}
          initialFontFamily={fontFamily}
        />
      )}
    </div>
  );
};

export default Clock;
