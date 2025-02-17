import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { safeFetch } from "../../utils/api";

const API_BASE_URL =
  "https://1c4f-2a0c-5a80-5203-a600-25bb-b0b1-52a3-5d41.ngrok-free.app";

// Obtener tareas
// "tasks" <- es el slice
// "fetchTasks" <- es la acción específica
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    return await safeFetch(`${API_BASE_URL}/`, {}, rejectWithValue);
  }
);

// Obtener las tareas mas recientes
export const fetchLatestTasks = createAsyncThunk(
  "tasks/fetchLatestTasks",
  async (_, { rejectWithValue }) => {
    return await safeFetch(`${API_BASE_URL}/latest`, {}, rejectWithValue);
  }
);

// Obtener una tarea
export const fetchSingleTask = createAsyncThunk(
  "tasks/fetchSingleTask",
  async (taskId, { rejectWithValue }) => {
    return await safeFetch(`${API_BASE_URL}/${taskId}`, {}, rejectWithValue);
  }
);

// Obtener el log de cambios
export const fetchTaskChangeLog = createAsyncThunk(
  "tasks/fetchTaskChangeLog",
  async (taskId, { rejectWithValue }) => {
    return safeFetch(
      `${API_BASE_URL}/${taskId}/changeLog`,
      {},
      rejectWithValue
    );
  }
);

// Crear una nueva tarea
export const createNewTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, { rejectWithValue }) => {
    return safeFetch(
      `${API_BASE_URL}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      },
      rejectWithValue
    );
  }
);

// Actualizar una tarea
export const updateExistingTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, updatedData }, { rejectWithValue }) => {
    return safeFetch(
      `${API_BASE_URL}/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      },
      rejectWithValue
    );
  }
);

// Eliminar una tarea
export const deleteExistingTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId, { rejectWithValue }) => {
    return safeFetch(
      `${API_BASE_URL}/${taskId}`,
      {
        method: "DELETE",
      },
      rejectWithValue
    ).then(() => taskId);
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    selectedTask: null,
    latestTasks: [],
    changeLog: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedTask: (state) => {
      state.selectedTask = null;
    },
    clearChangeLog: (state) => {
      state.changeLog = [];
    },
    clearAllTasks: (state) => {
      state.tasks = [];
      state.latestTasks = [];
      state.selectedTask = null;
      state.changeLog = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Obtener tareas
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Obtener tareas mas recientes
      .addCase(fetchLatestTasks.fulfilled, (state, action) => {
        state.latestTasks = action.payload;
      })

      // Obtener una tarea
      .addCase(fetchSingleTask.fulfilled, (state, action) => {
        state.selectedTask = action.payload;
      })

      // Obtener el log de cambios
      .addCase(fetchTaskChangeLog.fulfilled, (state, action) => {
        state.changeLog = action.payload;
      })

      // Crear una nueva tarea
      .addCase(createNewTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })

      // Actualizar una tarea
      .addCase(updateExistingTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.selectedTask?.id === action.payload.id) {
          state.selectedTask = action.payload;
        }
      })

      // Eliminar una tarea
      .addCase(deleteExistingTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        if (state.selectedTask?.id === action.payload) {
          state.selectedTask = null;
        }
      });
  },
});

export const { clearError, clearSelectedTask, clearChangeLog, clearAllTasks } =
  taskSlice.actions;

export default taskSlice.reducer;
