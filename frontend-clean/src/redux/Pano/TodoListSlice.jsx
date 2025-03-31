import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../Url";

export const getTodoListItems = createAsyncThunk(
  "todoList/getTodoListItems",
  async (todoListId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/pano/todolist/${todoListId}/items`
      );
      return { todoListId, items: response.data.todoItems };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch TodoList items"
      );
    }
  }
);

export const updateTodoListPosition = createAsyncThunk(
  "todoList/updateTodoListPosition",
  async ({ todoListId, XCoordinate, YCoordinate }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/pano/todolist/update-position/${todoListId}`,
        {
          XCoordinate,
          YCoordinate,
        }
      );
      return response.data.updatedTodoList;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update position"
      );
    }
  }
);

export const getTodoLists = createAsyncThunk(
  "todoList/getTodoLists",
  async (panoId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/pano/todolist/get/${panoId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch TodoLists"
      );
    }
  }
);

export const createTodoList = createAsyncThunk(
  "todoList/createTodoList",
  async (
    { panoId, XCoordinate, YCoordinate },
    { getState, rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_URL}/pano/todolist/create`, {
        panoId,
        XCoordinate,
        YCoordinate,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create TodoList"
      );
    }
  }
);

export const addTodoItem = createAsyncThunk(
  "todoList/addTodoItem",
  async ({ todoListId, todo, currentHour }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/pano/todolist/${todoListId}/add-item`,
        {
          todo,
          currentHour,
        }
      );
      return { todoListId, item: response.data.todoItem };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add Todo item");
    }
  }
);

export const updateTodoItem = createAsyncThunk(
  "todoList/updateTodoItem",
  async (
    { todoListId, todoItemIndex, todo, currentHour },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${API_URL}/pano/todolist/${todoListId}/update-item/${todoItemIndex}`,
        { todo, currentHour }
      );
      return {
        todoListId,
        todoItemIndex,
        updatedItem: response.data.updatedTodoItem,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update Todo item"
      );
    }
  }
);

export const deleteTodoItem = createAsyncThunk(
  "todoList/deleteTodoItem",
  async ({ todoListId, todoItemId }, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${API_URL}/pano/todolist/${todoListId}/delete-item/${todoItemId}`
      );
      return { todoListId, todoItemId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete Todo item"
      );
    }
  }
);

export const deleteTodoList = createAsyncThunk(
  "todoList/deleteTodoList",
  async (todoListId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/pano/todolist/delete/${todoListId}`);
      return todoListId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete TodoList"
      );
    }
  }
);

const TodoListSlice = createSlice({
  name: "TodoList",
  initialState: {
    todoLists: [],
    todoItems: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getTodoListItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTodoListItems.fulfilled, (state, action) => {
        const { todoListId, items } = action.payload;
        state.todoItems[todoListId] = items || [];
      })
      .addCase(getTodoListItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateTodoListPosition.fulfilled, (state, action) => {
        const updatedList = action.payload;
        const index = state.todoLists.findIndex(
          (list) => list._id === updatedList._id
        );
        if (index !== -1) {
          state.todoLists[index] = updatedList;
        }
      })

      .addCase(getTodoLists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTodoLists.fulfilled, (state, action) => {
        state.loading = false;
        state.todoLists = action.payload.todoLists || [];
      })
      .addCase(getTodoLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createTodoList.fulfilled, (state, action) => {})

      .addCase(deleteTodoList.fulfilled, (state, action) => {
        state.todoLists = state.todoLists.filter(
          (list) => list._id !== action.payload
        );
      })

      .addCase(addTodoItem.fulfilled, (state, action) => {
        const { todoListId, item } = action.payload;
        if (!state.todoItems[todoListId]) {
          state.todoItems[todoListId] = [];
        }
        state.todoItems[todoListId].push(item);
      })

      .addCase(updateTodoItem.fulfilled, (state, action) => {
        const { todoListId, todoItemIndex, updatedItem } = action.payload;
        if (state.todoItems[todoListId]) {
          state.todoItems[todoListId][todoItemIndex] = updatedItem;
        }
      })

      .addCase(deleteTodoItem.fulfilled, (state, action) => {
        const { todoListId, todoItemIndex } = action.payload;
        if (state.todoItems[todoListId]) {
          state.todoItems[todoListId].splice(todoItemIndex, 1);
        }
      });
  },
});

export default TodoListSlice.reducer;
