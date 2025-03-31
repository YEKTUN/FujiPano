import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {addTodoItem,getTodoLists} from "../../../redux/Pano/TodoListSlice"

const TodoEditModal = ({ isOpen, onClose,todoListId,panoId}) => {
  const [todo, setTodo] = useState("");
  const [currentHour, setCurrentHour] = useState("");
  const dispatch=useDispatch();

  const handleSubmit = async () => {
    if (!todo.trim() || !currentHour.trim()) {
      alert("Lütfen geçerli bir mesaj ve saat girin!");
      return;
    }
  
    try {
      await dispatch(addTodoItem({ todoListId, todo, currentHour })).unwrap();
      await dispatch(getTodoLists(panoId)); 
    } catch (error) {
      console.error("❌ Todo ekleme hatası:", error);
    }
  
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black ">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Yeni Görev Ekle</h2>
        <input
          type="text"
          placeholder="Görev girin..."
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="time"
          value={currentHour}
          onChange={(e) => setCurrentHour(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">İptal</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">Kaydet</button>
        </div>
      </div>
    </div>
  );
};

export default TodoEditModal;
