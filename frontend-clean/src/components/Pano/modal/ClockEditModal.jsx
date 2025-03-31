import React, { useState } from "react";
import { getCurrentClock, updateCurrentClock } from "../../../redux/Pano/CurrentClockSlice";
import { useDispatch } from "react-redux";

const ClockEditModal = ({ isOpen, onClose, clockId, panoId, initialFontSize, initialFontColor, initialFontFamily}) => {
  const [fontSize, setFontSize] = useState(initialFontSize || 16);
  const [fontColor, setFontColor] = useState(initialFontColor || "#000000");
  const [fontFamily, setFontFamily] = useState(initialFontFamily || "Arial");
const dispatch=useDispatch()
const handleSave = async () => {
  try {
    await dispatch(updateCurrentClock({ clockId, fontSize, fontColor, fontFamily })).unwrap();
    await dispatch(getCurrentClock(panoId));
  } catch (error) {
    console.error("❌ Saat güncellenirken hata oluştu:", error);
  }
  
  onClose();
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Saat Ayarları</h2>
        
        <label>Yazı Boyutu:</label>
        <input type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="w-full p-2 border rounded mb-2" />

        <label>Yazı Rengi:</label>
        <input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} className="w-full p-2 border h-10 rounded mb-2" />

        <label>Font Ailesi:</label>
        <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="w-full p-2 border rounded mb-2">
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="FontAwesome">FontAwesome</option>
        </select>

        <button onClick={handleSave} className="px-4  mt-2 py-2 bg-blue-500 text-white rounded">Kaydet</button>
      </div>
    </div>
  );
};

export default ClockEditModal;
