import React, { useState, useEffect } from "react";

const CalendarEditModal = ({ isOpen, onClose, onSave, event }) => {
  const [title, setTitle] = useState(event?.title || "");
  const [color, setColor] = useState(event?.color || "#FF5733");

  useEffect(() => {
    setTitle(event?.title || "");
    setColor(event?.color || "#FF5733");
  }, [event]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (title.trim()) {
      onSave(title, color);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-black w-96 p-4 rounded shadow text-black">
        <h2 className="text-xl font-bold mb-2">Etkinlik Düzenle</h2>

        <div className="mb-2">
          <label className="block font-semibold">Başlık</label>
          <input type="text" className="border p-2 w-full" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="mb-2">
          <label className="block font-semibold">Renk</label>
          <input type="color" className="border p-2 w-full" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>

        <div className="flex justify-end mt-4 space-x-2">
          <button onClick={onClose} className="border px-4 py-1 rounded">İptal</button>
          <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-1 rounded">Kaydet</button>
        </div>
      </div>
    </div>
  );
};

export default CalendarEditModal;
