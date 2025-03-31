import React, { useState,useRef,useEffect } from "react";
import TextEditModal from "./modal/TextEditModal";
import {deleteTextElement, getTextElements} from "../../redux/Pano/TextElementSlice";
import { useDispatch } from "react-redux";

const TextElement = ({ textId, text, panoId ,fontSize, fontColor, fontFamily }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const textRef = useRef(null);
  const [textWidth, setTextWidth] = useState(100);
  useEffect(() => {
    if (textRef.current) {
      setTextWidth(textRef.current.scrollWidth + 10); 
    }
  }, [text, fontSize, fontFamily]);
const dispatch = useDispatch();
 
  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY });
  };

  
  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };
  const handleDelete = async () => {
    try {
      await dispatch(deleteTextElement(  textId )).unwrap();
      await dispatch(getTextElements(panoId));
    } catch (error) {
      console.error("❌ Metin silme hatası:", error);
    }

    setIsModalOpen(false);
  };

  return (
    <div onContextMenu={handleContextMenu} onClick={handleCloseContextMenu} className="relative">
      <div  ref={textRef} style={{ fontSize: `${fontSize}px`, color: fontColor, fontFamily,whiteSpace: "nowrap", overflow: "visible", }} className="">
      {text}
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
            ✏️ Düzenle
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
        <TextEditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          textId={textId}
          panoId={panoId}
          initialText={text}
          initialFontSize={fontSize}
          initialFontColor={fontColor}
          initialFontFamily={fontFamily}
        />
      )}
    </div>
  );
};

export default TextElement;
