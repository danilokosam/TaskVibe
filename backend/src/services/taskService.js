import Task from "../models/Task.js";
import mongoose from "mongoose";

// Función auxiliar para validar ObjectId
const validateAndConvertId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID format");
  }
  return new mongoose.Types.ObjectId(id);
};

// Find all tasks by userId
export const findAllTasks = async (userId) => {
  try {
    const objectId = validateAndConvertId(userId);
    const tasks = await Task.find({ userId: objectId });
    return tasks || [];
  } catch (error) {
    console.error("Error al buscar tareas:", error);
    throw error;
  }
};

// Find a task by its ID and userId
export const findTaskById = async (taskId, userId) => {
  try {
    const userObjectId = validateAndConvertId(userId);
    const taskObjectId = validateAndConvertId(taskId);
    return await Task.findOne({ _id: taskObjectId, userId: userObjectId });
  } catch (error) {
    console.error("Error al buscar tarea por ID:", error);
    throw error;
  }
};

// Find the latest tasks by userId with a limit
export const findLatestTasks = async (userId, limit) => {
  try {
    const objectId = validateAndConvertId(userId);
    return await Task.find({ userId: objectId })
      .sort({ createdAt: -1 })
      .limit(limit);
  } catch (error) {
    console.error("Error al buscar últimas tareas:", error);
    throw error;
  }
};

// Create a new task and associate it with the authenticated user
export const createNewTask = async (taskData, userId) => {
  try {
    const objectId = validateAndConvertId(userId);
    const task = new Task({ ...taskData, userId: objectId });
    return await task.save();
  } catch (error) {
    console.error("Error al crear tarea:", error);
    throw error;
  }
};

// Update an existing task by taskId and userId
export const updateExistingTask = async (
  taskId,
  updateFields,
  changes,
  userId
) => {
  try {
    const userObjectId = validateAndConvertId(userId);
    const taskObjectId = validateAndConvertId(taskId);
    return await Task.findOneAndUpdate(
      { _id: taskObjectId, userId: userObjectId },
      {
        $set: updateFields,
        $push: {
          changeLog: {
            $each: [{ date: new Date(), changes }],
            $slice: -10,
          },
        },
      },
      { new: true }
    );
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
    throw error;
  }
};

// Delete a task by taskId and userId
export const deleteExistingTask = async (taskId, userId) => {
  try {
    const userObjectId = validateAndConvertId(userId);
    const taskObjectId = validateAndConvertId(taskId);
    return await Task.findOneAndDelete({
      _id: taskObjectId,
      userId: userObjectId,
    });
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
    throw error;
  }
};

// Get the change log of a task by taskId and userId
export const getTaskLog = async (taskId, userId) => {
  try {
    const userObjectId = validateAndConvertId(userId);
    const taskObjectId = validateAndConvertId(taskId);
    const task = await Task.findOne({
      _id: taskObjectId,
      userId: userObjectId,
    });
    if (!task) return null;
    return task.changeLog || [];
  } catch (error) {
    console.error("Error al obtener log de cambios:", error);
    throw error;
  }
};
