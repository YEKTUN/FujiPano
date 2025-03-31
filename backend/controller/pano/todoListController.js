const TodoList = require("../../model/utils/todoList");
const Pano = require("../../model/panoModel");
const mongoose = require("mongoose");

const getTodoLists = async (req, res) => {
  try {
    const { panoId } = req.params;

    if (!panoId) {
      return res.status(400).json({ error: "panoId is required" });
    }

    const todoLists = await TodoList.find({ panoId });

    res
      .status(200)
      .json({ message: "Todo Lists fetched successfully!", todoLists });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const getTodoListItems = async (req, res) => {
  try {
    const { todoListId } = req.params;

    const todoList = await TodoList.findById(todoListId);

    if (!todoList) {
      return res.status(404).json({ error: "Todo List not found" });
    }

    res
      .status(200)
      .json({
        message: "Todo List items fetched successfully!",
        todoItems: todoList.todoItems,
      });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const createTodoList = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { panoId, XCoordinate, YCoordinate } = req.body;

    if (!panoId) {
      return res
        .status(400)
        .json({ message: "Eksik bilgiler: panoId gereklidir!" });
    }

    const pano = await Pano.findById(panoId).session(session);
    if (!pano) {
      return res.status(404).json({ error: "Pano bulunamadı!" });
    }

    const newTodoList = await TodoList.create(
      [{ panoId, XCoordinate, YCoordinate, todoItems: [] }],
      { session }
    );

    console.log("✅ Yeni TodoList Kaydedildi:", newTodoList[0]);

    if (!pano.todoList) {
      pano.todoList = [];
    }
    pano.todoList.push(newTodoList[0]._id);
    await pano.save({ session });

    await session.commitTransaction();
    session.endSession();

    res
      .status(201)
      .json({
        message: "Todo List başarıyla oluşturuldu!",
        data: newTodoList[0],
      });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("❌ Todo List oluşturma hatası:", error.stack);
    res.status(500).json({ message: "❌ Sunucu hatası", error: error.message });
  }
};

const addTodoItem = async (req, res) => {
  try {
    const { todoListId } = req.params;
    const { todo, currentHour } = req.body;

    const todoList = await TodoList.findById(todoListId);
    if (!todoList) {
      return res.status(404).json({ error: "Todo List not found" });
    }

    todoList.todoItems.push({ todo, currentHour });
    await todoList.save();

    res
      .status(201)
      .json({ message: "Todo item added successfully!", todoList });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const updateTodoItem = async (req, res) => {
  try {
    const { todoListId, todoItemIndex } = req.params;
    const { todo, currentHour } = req.body;

    const todoList = await TodoList.findById(todoListId);
    if (!todoList) {
      return res.status(404).json({ error: "Todo List not found" });
    }

    if (!todoList.todoItems[todoItemIndex]) {
      return res.status(404).json({ error: "Todo Item not found" });
    }

    todoList.todoItems[todoItemIndex].todo = todo;
    todoList.todoItems[todoItemIndex].currentHour = currentHour;
    await todoList.save();

    res
      .status(200)
      .json({ message: "Todo item updated successfully!", todoList });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const deleteTodoItem = async (req, res) => {
  try {
    const { todoListId, todoItemId } = req.params;

    const todoList = await TodoList.findById(todoListId);
    if (!todoList) {
      return res.status(404).json({ error: "Todo Listesi bulunamadı" });
    }

    const itemIndex = todoList.todoItems.findIndex(
      (item) => item._id.toString() === todoItemId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ error: "Todo öğesi bulunamadı" });
    }

    todoList.todoItems.splice(itemIndex, 1);

    await todoList.save();

    res
      .status(200)
      .json({
        message: "Todo öğesi başarıyla silindi!",
        updatedTodoList: todoList,
      });
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası", details: error.message });
  }
};

const updateTodoListPosition = async (req, res) => {
  try {
    const { todoListId } = req.params;
    const { XCoordinate, YCoordinate } = req.body;

    const updatedTodoList = await TodoList.findByIdAndUpdate(
      todoListId,
      { XCoordinate, YCoordinate },
      { new: true }
    );

    if (!updatedTodoList) {
      return res.status(404).json({ error: "Todo List not found" });
    }

    res
      .status(200)
      .json({ message: "Todo List position updated!", updatedTodoList });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const deleteTodoList = async (req, res) => {
  try {
    const { todoListId } = req.params;

    const deletedTodoList = await TodoList.findByIdAndDelete(todoListId);

    if (!deletedTodoList) {
      return res.status(404).json({ error: "Todo List not found" });
    }

    await Pano.updateMany(
      { todoList: todoListId },
      { $pull: { todoList: todoListId } }
    );

    res.status(200).json({ message: "Todo List deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

module.exports = {
  createTodoList,
  addTodoItem,
  updateTodoItem,
  deleteTodoItem,
  getTodoLists,
  getTodoListItems,
  updateTodoListPosition,
  deleteTodoList,
};
