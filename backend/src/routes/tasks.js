import express from "express";
import {
  getAllTasks,
  getSingleTask,
  getLatestTasks,
  createTask,
  updateTask,
  getTaskChangeLog,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/", getAllTasks);
router.get("/latest", getLatestTasks);
router.get("/:id", getSingleTask);
router.get("/:id/changeLog", getTaskChangeLog);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
