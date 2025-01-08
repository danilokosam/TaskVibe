import express from "express";
import connectToDataBase from "../db/conn";
import { ObjectId } from "mongodb";

const router = express.Router();

//👉 Get a list of all tasks 
router.get("/", async (req, res) => {
  try {
    const db = await connectToDataBase();
    const collection = db.collection("tasks");

    const result = await collection.find({}).limit(20).toArray();

    res.status(200).send(result);
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
    res.status(500).send({ message: "Error fetching tasks", error });
  }
});

//🤖 Get a single task
router.get("/:id", async (req, res) => {
  try {
    const db = await connectToDataBase();
    const collection = db.collection("tasks");
    const result = await collection.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!result) {
      return res.status(404).send({ message: "Task not found" });
    }

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: "Error fetching the task", error });
  }
});

//🦄 Fetches the latest tasks
router.get("/latest", async (req, res) => {
  let limit = parseInt(req.query.limit) || 3; // Default limit is 3

  // Ensure limit is a number between 1 and 10
  limit = Math.max(1, Math.min(limit, 10));

  try {
    const db = await connectToDataBase();
    const collection = db.collection("tasks");

    const results = await collection
      .aggregate([
        { $project: { title: 1, description: 1, completed: 1, createdAt: 1 } }, // Select specific fields
        { $sort: { createdAt: -1 } }, // Sort by createdAt in descending order
        { $limit: limit }, // Limit the number of results
      ])
      .toArray();

    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({ message: "Error fetching the latest tasks", error });
  }
});

//🐕 Add a new task to the collection
router.post("/", async (req, res) => {
  try {
    const db = await connectToDataBase();
    const collection = db.collection("tasks");
    const result = await collection.insertOne(req.body);

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: "Error adding the task", error });
  }
});

//🔥 Update a task
router.put("/:id", async (req, res) => {
  try {
    // Validate ID
    const taskId = req.params.id;
    if (!ObjectId.isValid(taskId)) {
      return res.status(400).send({ message: "Invalid task ID" });
    }

    // Validate data to update
    const { title, description, completed, deadline } = req.body;
    const updateFields = {};
    const changes = {};

    if (title) {
      updateFields.title = title;
      changes.title = title;
    }
    if (description) {
      updateFields.description = description;
      changes.description = description;
    }
    if (typeof completed === "boolean") {
      updateFields.completed = completed;
      changes.completed = completed;
    }
    if (deadline) {
      updateFields.deadline = new Date(deadline);
      changes.deadline = new Date(deadline);
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).send({ message: "No changes provided" });
    }

    // Connect to the database
    const db = await connectToDataBase();
    const collection = db.collection("tasks");

    // Update the task and push changes to changeLog
    const result = await collection.updateOne(
      { _id: new ObjectId(taskId) },
      {
        $set: updateFields,
        $push: {
          changeLog: {
            $each: [{ date: new Date(), changes }],
            $slice: -10, // Limit to the last 10 changes
          },
        },
      }
    );

    // Check if the task was found and updated
    if (result.modifiedCount === 0) {
      return res.status(404).send({ message: "Task not found" });
    }

    res.status(200).send({ message: "Task updated successfully", changes });
  } catch (error) {
    res.status(500).send({ message: "Error updating the task", error });
  }
});

//📚 Get the changeLog of a task
router.get("/:id/changeLog", async (req, res) => {
  try {
    // Validate ID
    const taskId = req.params.id;
    if (!ObjectId.isValid(taskId)) {
      return res.status(400).send({ message: "Invalid task ID" });
    }

    // Connect to the database
    const db = await connectToDataBase();
    const collection = db.collection("tasks");

    // Find the task and get its changeLog
    const task = await collection.findOne(
      { _id: new ObjectId(taskId) },
      { projection: { changeLog: 1 } }
    );

    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    res.status(200).send(task.changeLog);
  } catch (error) {
    res.status(500).send({ message: "Error fetching the change log", error });
  }
});

//🚀 Delete a task
router.delete("/:id", async (req, res) => {
  try {
    // Validate ID
    const taskId = req.params.id;
    if (!ObjectId.isValid(taskId)) {
      return res.status(400).send({ message: "Invalid task ID" });
    }

    // Connect to the database
    const db = await connectToDataBase();
    const collection = db.collection("tasks");

    // Check if the task exists
    const task = await collection.findOne({ _id: new ObjectId(taskId) });
    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    // Delete the task
    const result = await collection.deleteOne({ _id: new ObjectId(taskId) });

    // Check if the task was deleted successfully
    if (result.deletedCount === 0) {
      return res.status(500).send({ message: "Failed to delete task" });
    }

    res.status(200).send({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting the task", error });
  }
});

export default router;
