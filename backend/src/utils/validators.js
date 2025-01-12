import { ObjectId } from "mongodb";

export const validateObjectId = (id) => {
  if (!ObjectId.isValid(id)) {
    return {
      isValid: false,
      message: "The provided task ID is not valid.",
    };
  }
  return { isValid: true };
};

export const validateUpdateData = (body) => {
  const { title, description, completed, deadline } = body;
  const updateFields = {};
  const changes = {};

  // Validar título
  if (title) {
    if (typeof title !== "string" || title.trim().length === 0) {
      return { error: "Title must be a non-empty string" };
    }
    updateFields.title = title.trim();
    changes.title = title.trim();
  }

  // Validar descripción
  if (description && typeof description === "string") {
    updateFields.description = description.trim();
    changes.description = description.trim();
  }

  // Validar estado completado
  if (typeof completed === "boolean") {
    updateFields.completed = completed;
    changes.completed = completed;
  }

  // Validar fecha límite
  if (deadline) {
    const date = new Date(deadline);
    if (isNaN(date.getTime())) {
      return { error: "Invalid deadline format" };
    } else if (date <= new Date()) {
      return { error: "Deadline must be a future date" };
    }
    updateFields.deadline = date;
    changes.deadline = date;
  }

  // Verificar si hay cambios
  if (Object.keys(updateFields).length === 0) {
    return {
      error: "No changes provided.",
    };
  }

  return { updateFields, changes };
};
