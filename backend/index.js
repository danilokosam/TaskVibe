import app from "./src/server.js";
import "./loadEnvironment.js";
import "express-async-errors";

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
