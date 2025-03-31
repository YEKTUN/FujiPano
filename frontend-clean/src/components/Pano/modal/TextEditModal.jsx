import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateTextElement } from "../../../redux/Pano/TextElementSlice";

const TextEditModal = ({ isOpen, onClose, textId, initialText, initialFontSize, initialFontColor, initialFontFamily }) => {
  const [text, setText] = useState(initialText);
  const [fontSize, setFontSize] = useState(initialFontSize || 16);
  const [fontColor, setFontColor] = useState(initialFontColor || "#000000");
  const [fontFamily, setFontFamily] = useState(initialFontFamily || "Arial");

  const dispatch = useDispatch();

  const handleSave = async () => {
    if (!text.trim()) {
      alert("Lütfen bir metin girin!");
      return;
    }

    try {
      await dispatch(updateTextElement({ textElementId: textId, text, fontSize, fontColor, fontFamily })).unwrap();
    } catch (error) {
      console.error("❌ Metin güncelleme hatası:", error);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Metni Düzenle</h2>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="w-full p-2 border rounded mb-2" />

        <label>Yazı Boyutu:</label>
        <input type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="w-full p-2 border rounded mb-2" />

        <label>Yazı Rengi:</label>
        <input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} className="w-full p-2 border rounded mb-2 h-10" />

        <label>Font Ailesi:</label>
        <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="w-full p-2 border rounded mb-2">
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="FontAwesome">FontAwesome</option>
        </select>

        <div className="flex justify-end space-x-2 mt-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">İptal</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">Kaydet</button>
        </div>
      </div>
    </div>
  );
};

export default TextEditModal;
