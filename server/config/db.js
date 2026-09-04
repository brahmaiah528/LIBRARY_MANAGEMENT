const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/library_management';
  
  try {
    console.log(`Connecting to MongoDB at: ${uri}...`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('MongoDB connected successfully (Local Instance).');
  } catch (err) {
    console.warn(`Local MongoDB connection failed (${err.message}).`);
    console.log('Launching in-memory MongoDB fallback server...');
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const inMemoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(inMemoryUri);
      console.log(`MongoDB Connected successfully (In-Memory Fallback Server): ${inMemoryUri}`);
    } catch (fallbackErr) {
      console.error('Failed to start in-memory MongoDB server:', fallbackErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
