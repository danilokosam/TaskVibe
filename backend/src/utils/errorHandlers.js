export const handleDatabaseOperation = async (res, operation, next = null) => {
  try {
    await operation();
  } catch (error) {
    console.error("❌ Error:", error);

    if (next) {
      next(error);
    } else {
      res
        .status(500)
        .send({ message: "Error performing database operation", error });
    }
  }
};
