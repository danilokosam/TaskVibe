// src/config/db.js
import mongoose from 'mongoose';

const connectToDatabase = async () => {
  try {
    const connectionString = process.env.ATLAS_URI;
    if (!connectionString) {
      throw new Error('ATLAS_URI is not defined in environment variables');
    }

    console.log('Attempting to connect to MongoDB...');

    const options = {
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      }
    };

    mongoose.connection.on('connecting', () => {
      console.log('Connecting to MongoDB...');
    });

    mongoose.connection.on('connected', () => {
      console.log('Successfully connected to MongoDB');
    });

    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });

    await mongoose.connect(connectionString, options);
    console.log('Connected to MongoDB ✅');

    return mongoose.connection.db;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    throw error;
  }
};

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});

export default connectToDatabase;