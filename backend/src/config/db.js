import { MongoClient } from "mongodb";
const connectionString = process.env.ATLAS_URI || "";
const client = new MongoClient(connectionString);
let db;

async function connectToDataBase() {
  if (db) return db; // <- already connected

  const client = new MongoClient(connectionString);

  try {
    await client.connect();
    console.log("Connected to MongoDB ✅");

    // Connect to the database
    db = client.db("todoApp");
    return db;
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  if (client) {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
  process.exit(0);
});

export default connectToDataBase;
