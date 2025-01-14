import Task from "../models/Task";

// Find all tasks by userId
export const findAllTasks = async (userId) => {
  return await Task.find({ userId });
};

// Find a task by its ID and userId
export const findTaskById = async (taskId, userId) => {
  return await Task.findOne({ _id: taskId, userId });
};

// Find the latest tasks by userId with a limit
export const findLatestTasks = async (userId, limit) => {
  return await Task.find({ userId }).sort({ createdAt: -1 }).limit(limit);
};

// Create a new task and associate it with the authenticated user
export const createNewTask = async (taskData, userId) => {
  const task = new Task({ ...taskData, userId });
  return await task.save();
};

// Update an existing task by taskId and userId
export const updateExistingTask = async (
  taskId,
  updateFields,
  changes,
  userId
) => {
  return await Task.findOneAndUpdate(
    { _id: taskId, userId },
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
};

// Delete a task by taskId and userId
export const deleteExistingTask = async (taskId, userId) => {
  return await Task.findOneAndDelete({ _id: taskId, userId });
};

// Get the change log of a task by taskId and userId
export const getTaskLog = async (taskId, userId) => {
  const task = await Task.findOne({ _id: taskId, userId });
  if (!task) return null;
  return task.changeLog || [];
};
