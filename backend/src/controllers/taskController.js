import { validateObjectId, validateUpdateData } from "../utils/validators";
import { handleDatabaseOperation } from "../utils/errorHandlers";
import {
  findAllTasks,
  findTaskById,
  findLatestTasks,
  createNewTask,
  updateExistingTask,
  deleteExistingTask,
  getTaskLog,
} from "../services/taskService";

export const getAllTasks = async (_req, res, next) => {
  await handleDatabaseOperation(
    res,
    async () => {
      const tasks = await findAllTasks();
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
      const task = await findTaskById(taskId);
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
      const tasks = await findLatestTasks(limit);
      res.status(200).json(tasks);
    },
    next
  );
};

export const createTask = async (req, res, next) => {
  await handleDatabaseOperation(
    res,
    async () => {
      const result = await createNewTask(req.body);
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
        changes
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

      const changeLog = await getTaskLog(req.params.id);
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

      const result = await deleteExistingTask(req.params.id);
      if (!result) {
        return res.status(404).send({ message: "Task not found" });
      }

      res.status(200).json({ message: "Task deleted successfully" });
    },
    next
  );
};
