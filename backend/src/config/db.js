const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/thematic_copy_trading';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick fail if local mongo is offline
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${uri}.`);
    console.warn(`[MongoDB Warning] Operating in Hybrid Memory-Store Mode. All API routes will function normally for development & testing!`);
    console.warn(`[MongoDB Tip] To connect to a live MongoDB instance, start mongod locally or set MONGODB_URI in backend/.env`);
  }
};

const getDbStatus = () => isConnected;

module.exports = { connectDB, getDbStatus };
