const errorHandler = (err, _req, res) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "Invalid token" });
  }

  console.error(err);
  res.status(500).json({ message: "Uh oh! An unexpected error occurred." });
};

export default errorHandler;
