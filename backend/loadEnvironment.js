import dotenv from "dotenv";

dotenv.config();

if ( !process.env.ATLAS_URI ) {
    console.error("ERROR: No DATABASE_URL environment variable has been defined.");
    process.exit(1);
} else {
    console.log("DATABASE_URL: " + process.env.ATLAS_URI);
}