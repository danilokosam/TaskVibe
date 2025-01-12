import { ObjectId } from "mongodb";
import connectToDataBase from "../config/db";

export const findAllTasks = async () => {
  const db = await connectToDataBase();
  const collection = db.collection("tasks");
  return collection.find({}).sort({ createdAt: -1 }).limit(20).toArray();
};

export const findTaskById = async (id) => {
  const db = await connectToDataBase();
  const collection = db.collection("tasks");
  return collection.findOne({ _id: new ObjectId(id) });
};

export const findLatestTasks = async (limit) => {
  const db = await connectToDataBase();
  const collection = db.collection("tasks");
  return collection
    .aggregate([
      { $project: { title: 1, description: 1, completed: 1, createdAt: 1 } }, // Select specific fields
      { $sort: { createdAt: -1 } }, // Sort by createdAt in descending order
      { $limit: limit }, // Limit the number of results
    ])
    .toArray();
};

export const createNewTask = async (taskData) => {
  const db = await connectToDataBase();
  const collection = db.collection("tasks");
  return collection.insertOne({
    ...taskData,
    createdAt: new Date(),
    changeLog: [],
  });
};

export const updateExistingTask = async (id, updateFields, changes) => {
  const db = await connectToDataBase();
  const collection = db.collection("tasks");

  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: updateFields,
      $push: {
        changeLog: {
          $each: [{ date: new Date(), changes }],
          $slice: -10,
        },
      },
    }
  );

  return result.modifiedCount > 0;
};

export const getTaskLog = async (id) => {
  const db = await connectToDataBase();
  const collection = db.collection("tasks");

  const task = await collection.findOne(
    { _id: new ObjectId(id) },
    { projection: { changeLog: 1 } }
  );

  return task?.changeLog;
};

export const deleteExistingTask = async (id) => {
  const db = await connectToDataBase();
  const collection = db.collection("tasks");

  const task = await collection.findOne({ _id: new ObjectId(id) });
  if (!task) return false;

  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
};
