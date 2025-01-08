import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTasks,
  addTask,
  deleteTask,
  clearAllTasks,
} from "../store/slices/taskSlice";

import TableList  from "@/components/TableList";

const TaskList = () => {
  const { tasks, loading, error } = useSelector((state) => state.tasks); // Obtiene las tareas del store
  const dispatch = useDispatch(); // Para despachar acciones
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCompleted, setNewTaskCompleted] = useState(false);
  const [isDescending, setIsDescending] = useState(false);
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    // console.log("Dispatching fetchTasks..."); // Comprobamos si se esta haciendo el dispatch
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleAddTask = () => {
    if (newTaskTitle.trim() !== "") {
      dispatch(
        addTask({
          id: Date.now(),
          title: newTaskTitle,
          completed: newTaskCompleted,
        })
      );
      setNewTaskTitle(""); // Limpia el campo de texto del input
      setNewTaskCompleted(false); // Reinicia el estado del checkbox
    }
  };

  const handleDeleteTask = useCallback((taskId) => {
    console.log(`handleDeleteTask creado para ID: ${taskId}`);
    dispatch(deleteTask(taskId));
  }, [dispatch]);

  const handleClearAllTasks = () => {
    dispatch(clearAllTasks());
  };

  const sortedTasks = useMemo(() => {
    console.log("Ordenando tareas...");
    return tasks.toSorted((a, b) => {
      if (sortBy === "id") return isDescending ? b.id - a.id : a.id - b.id;
      if (sortBy === "title")
        return isDescending
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title);
      if (sortBy === "completed")
        return isDescending
          ? a.completed - b.completed
          : b.completed - a.completed;
      return 0;
    });
  }, [tasks, sortBy, isDescending]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="task-container text-zinc-50 min-h-screen flex flex-col items-center py-4 gap-2">
      <h2 className=" w-full h-10 flex items-center justify-center text-3xl font-semibold">
        Lista de tareas
      </h2>
      <button
        onClick={handleClearAllTasks}
        className="border-2 bg-red-600 text-zinc-950 font-semibold border-none p-1 text-sm rounded hover:text-slate-200 duration-300"
      >
        Eliminar todas las tareas
      </button>
      <input
        type="text"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        placeholder="Ingresar nueva tarea"
        className="text-zinc-950 rounded-lg"
      />
      <label>
        Completada:
        <input
          type="checkbox"
          checked={newTaskCompleted}
          onChange={(e) => setNewTaskCompleted(e.target.checked)}
        />
      </label>
      <button
        onClick={handleAddTask}
        className="border-2 bg-green-400 text-zinc-950 font-semibold  border-none p-1 text-sm rounded hover:text-slate-200 duration-300"
      >
        Añadir tarea
      </button>
      <hr />
      <label>
        Ordernar por:
        <select
          defaultValue=""
          className="text-zinc-950 rounded-lg"
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="" disabled>
            Selecciona una opción
          </option>
          <option value="id">ID</option>
          <option value="title">Tarea</option>
          <option value="completed">Completada</option>
        </select>
      </label>
      <label>
        Ordenar Descendente:
        <input
          type="checkbox"
          checked={isDescending}
          onChange={(e) => setIsDescending(e.target.checked)}
        />
      </label>
      <TableList tasks={sortedTasks} onDeleteTask={handleDeleteTask} />
    </div>
  );
};

export default TaskList;
