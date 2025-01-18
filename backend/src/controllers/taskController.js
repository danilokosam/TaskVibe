import { validateObjectId, validateUpdateData } from "../utils/validators.js";
import { handleDatabaseOperation } from "../utils/errorHandlers.js";
import {
  findAllTasks,
  findTaskById,
  findLatestTasks,
  createNewTask,
  updateExistingTask,
  deleteExistingTask,
  getTaskLog,
} from "../services/taskService.js";

export const getAllTasks = async (req, res, next) => {
  await handleDatabaseOperation(
    res,
    async () => {
      const tasks = await findAllTasks(req.userId);
      res.status(200).send(tasks);
    },
    next
  );
};

export const getSingleTask = async (req, res, next) => {
  await handleDatabaseOperation(
    res,
    async () => {
      const taskId = req.params.id;
      const task = await findTaskById(taskId, req.userId);
      if (!task) {
        return res.status(404).send({ message: "Task not found" });
      }
      res.status(200).send(task);
    },
    next
  );
};

export const getLatestTasks = async (req, res, next) => {
  await handleDatabaseOperation(
    res,
    async () => {
      let limit = parseInt(req.query.limit) || 3;
      limit = Math.max(1, Math.min(limit, 10));
      const tasks = await findLatestTasks(req.userId, limit);
      res.status(200).json(tasks);
    },
    next
  );
};

export const createTask = async (req, res, next) => {
  if (!req.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  await handleDatabaseOperation(
    res,
    async () => {
      const result = await createNewTask(req.body, req.userId);
      res.status(201).send(result);
    },
    next
  );
};

export const updateTask = async (req, res, next) => {
  await handleDatabaseOperation(
    res,
    async () => {
      const { isValid, message } = validateObjectId(req.params.id);
      if (!isValid) {
        return res.status(400).send({ message });
      }

      const { updateFields, changes, error } = validateUpdateData(req.body);
      if (error) {
        return res.status(400).send({ message: error });
      }

      const result = await updateExistingTask(
        req.params.id,
        updateFields,
        changes,
        req.userId
      );
      if (!result) {
        return res.status(404).send({ message: "Task not found" });
      }

      res.status(200).json({ message: "Task updated successfully", changes });
    },
    next
  );
};

export const getTaskChangeLog = async (req, res, next) => {
  await handleDatabaseOperation(
    res,
    async () => {
      const { isValid, message } = validateObjectId(req.params.id);
      if (!isValid) {
        return res.status(400).send({ message });
      }

      const changeLog = await getTaskLog(req.params.id, req.userId);
      if (!changeLog) {
        return res.status(404).send({ message: "Task not found" });
      }

      res.status(200).send(changeLog);
    },
    next
  );
};

export const deleteTask = async (req, res, next) => {
  await handleDatabaseOperation(
    res,
    async () => {
      const { isValid, message } = validateObjectId(req.params.id);
      if (!isValid) {
        return res.status(400).send({ message });
      }

      const result = await deleteExistingTask(req.params.id, req.userId);
      if (!result) {
        return res.status(404).send({ message: "Task not found" });
      }

      res.status(200).json({ message: "Task deleted successfully" });
    },
    next
  );
};
