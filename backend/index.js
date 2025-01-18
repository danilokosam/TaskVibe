// src/index.js
import dotenv from 'dotenv';
import app from './src/server.js';
import connectToDatabase from './src/config/db.js';

// Cargar variables de entorno
dotenv.config();

const PORT = process.env.PORT || 5050;

const startServer = async () => {
  try {
    await connectToDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} 🚀`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();