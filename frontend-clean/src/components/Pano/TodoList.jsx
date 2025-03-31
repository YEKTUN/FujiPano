import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  deleteTodoList,
  deleteTodoItem,
  getTodoLists,
} from "../../redux/Pano/TodoListSlice";
import TodoEditModal from "./modal/TodoEditModal";

const TodoList = ({ panoId, todoItems, todoListId }) => {
  const dispatch = useDispatch();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const checkTodoStatus = (todoHour) => {
    if (!todoHour || !todoHour.includes(":")) return "Bilinmeyen Zaman";
    const [todoHourInt, todoMinuteInt] = todoHour.split(":").map(Number);
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    if (todoHourInt === currentHour && todoMinuteInt === currentMinute) {
      return { status: "now", text: "🔴 Şuanda Todo" };
    } else if (
      todoHourInt > currentHour ||
      (todoHourInt === currentHour && todoMinuteInt > currentMinute)
    ) {
      return { status: "future", text: `🕒 ${todoHour}` };
    } else {
      return { status: "past", text: `✅ ${todoHour}` };
    }
  };

  const handleContextMenu = (event, item) => {
    event.preventDefault();

    setTimeout(() => {
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        item,
      });
    }, 500);
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleDeleteTodoList = () => {
    dispatch(deleteTodoList(todoListId));
  };

  const handleDeleteTodoItem = async () => {
    try {
      if (!selectedTodo) {
        console.log("Silinecek todo bulunamadı!");
        return;
      }

      await dispatch(
        deleteTodoItem({ todoListId, todoItemId: selectedTodo._id })
      ).unwrap();
      await dispatch(getTodoLists(panoId));

      handleCloseContextMenu();
    } catch (error) {}
  };

  const handleEditTodo = () => {
    setIsModalOpen(true);
    setContextMenu(null);
  };
  useEffect(() => {
    if (selectedTodo) {
      console.log(selectedTodo);
    }
  }, [selectedTodo]);

  const getRandomColor = () => {
    const colors = [
      "border-l-red-500",
      "border-l-blue-500",
      "border-l-green-500",
      "border-l-yellow-500",
      "border-l-purple-500",
      "border-l-pink-500",
      "border-l-indigo-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const nowTodos = todoItems.filter(
    (item) => checkTodoStatus(item.currentHour).status === "now"
  );
  const futureTodos = todoItems.filter(
    (item) => checkTodoStatus(item.currentHour).status === "future"
  );
  const pastTodos = todoItems.filter(
    (item) => checkTodoStatus(item.currentHour).status === "past"
  );

  return (
    <div
      onClick={handleCloseContextMenu}
      onContextMenu={handleContextMenu}
      className="relative w-[300px]"
    >
      <h2 className="font-bold  text-[#104a57] text-lg mb-2 pl-16 pt-4 pb-2 z-10">
        Günlük Yapılacaklar
      </h2>

      <div className="text-md text-white absolute top-3 font-semibold pl-[250px]">
        {currentTime.toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>

      {nowTodos.length > 0 && (
        <div className="mb-4 p-4 bg-red-200 border rounded-lg ">
          <h3 className="font-semibold">🔴 Şuanda Yapılanlar</h3>
          {nowTodos.map((item) => (
            <div
              key={item._id}
              onClick={() => setSelectedTodo(item)}
              onContextMenu={(event) => handleContextMenu(event, item)}
              className="flex items-center justify-between p-2 border rounded-lg bg-gray-100 mt-2 cursor-pointer"
            >
              <span className="mr-2 font-semibold">{item.todo}</span>
              <span className="mr-2">
                {checkTodoStatus(item.currentHour).text}
              </span>
            </div>
          ))}
        </div>
      )}

      {futureTodos.length > 0 && (
        <div className="mb-4 p-4 bg-blue-100 border rounded-lg">
          <h3 className="font-semibold">🕒 Yaklaşan Görevler</h3>
          {futureTodos.map((item) => (
            <div
              key={item._id}
              onClick={() => setSelectedTodo(item)}
              onContextMenu={(event) => handleContextMenu(event, item)}
              className={`flex items-center justify-between p-2 border-l-4 ${getRandomColor()} rounded-lg mt-2 bg-gray-100 cursor-pointer`}
            >
              <span className="mr-2 font-semibold">{item.todo}</span>
              <span className="mr-2">
                {checkTodoStatus(item.currentHour).text}
              </span>
            </div>
          ))}
        </div>
      )}

      {pastTodos.length > 0 && (
        <div className="mb-4 p-2 bg-gray-300 shadow-sm shadow-amber-100 rounded-lg">
          <h3 className="font-semibold">✅ Geçmiş Görevler</h3>
          {pastTodos.map((item) => (
            <div
              key={item._id}
              onClick={() => setSelectedTodo(item)}
              onContextMenu={(event) => handleContextMenu(event, item)}
              className={`flex items-center justify-between p-2 border-l-4 ${getRandomColor()} rounded-lg mt-2 bg-gray-200 cursor-pointer`}
            >
              <span className="mr-2 font-semibold">{item.todo}</span>
              <span className="mr-2">
                {checkTodoStatus(item.currentHour).text}
              </span>
            </div>
          ))}
        </div>
      )}

      {contextMenu && (
        <div
          className="bg-white shadow-lg border rounded-md p-2"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            className="block w-full px-4 py-2 text-left hover:bg-gray-200"
            onClick={handleEditTodo}
          >
            ⚙️ Ayarlar
          </button>
          <button
            className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-200"
            onClick={handleDeleteTodoList}
          >
            🗑 TodoList Sil
          </button>
          <button
            className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-200"
            onClick={handleDeleteTodoItem}
          >
            🗑 Seçilen Todoyu Sil
          </button>
        </div>
      )}
      {isModalOpen && (
        <TodoEditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={selectedTodo}
          todoListId={todoListId}
          panoId={panoId}
        />
      )}
    </div>
  );
};

export default TodoList;
