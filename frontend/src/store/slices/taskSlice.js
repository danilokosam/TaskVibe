import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    // console.log("Fetched data:", data); // Comprobamos si se está recibiendo la data
    return data;
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    throw error;
  }
});

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },
  reducers: {
    addTask: (state, action) => {
      console.log("Agregando tarea...", action);
      state.tasks.push(action.payload); // Agrega la tarea al array
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload); // Filtramos el array, para obtener todas las tareas excepto la que se elimina
    },
    updateTask: (state, action) => {
      const { id, updatedTask } = action.payload;
      const taskIndex = state.tasks.findIndex((task) => task.id === id); // Busca en tasks
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = updatedTask; // Actualiza el array de tasks
      }
    },
    clearAllTasks: (state) => {
      state.tasks = []; // Limpia el array de tasks
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null; // Limpiamos cualquier error previo
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload; // Guardamos los datos obtenidos
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Guardamos el error
      });
  },
});

export const { addTask, deleteTask, updateTask, clearAllTasks } =
  taskSlice.actions;
export default taskSlice.reducer;
