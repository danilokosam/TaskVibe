// models/Task.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    deadline: {
      type: Date,
      required: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    changeLog: [
      {
        date: { type: Date, required: true }, // Fecha del cambio
        changes: { type: Object, required: true }, // Cambios realizados
      },
    ],
  },
  {
    timestamps: true, // Add fields such as created_at and updated_at
  }
);

export default mongoose.model("Task", taskSchema);
