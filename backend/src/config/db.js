
const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI?.trim();
  console.log(
  '[MongoDB] Connection string format:',
  uri?.startsWith('mongodb+srv://') ||
  uri?.startsWith('mongodb://')
    ? 'VALID'
    : 'INVALID'
);

  if (!uri) {
    console.error('[MongoDB] MONGODB_URI is missing!');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    isConnected = true;

    console.log(
      '[MongoDB] Connected successfully to host:',
      conn.connection.host
    );
  } catch (error) {
    isConnected = false;

    console.error('[MongoDB Error Name]:', error.name);
    console.error('[MongoDB Error Message]:', error.message);

    console.warn('[MongoDB] Running in fallback mode.');
  }
};

const getDbStatus = () => isConnected;

module.exports = { connectDB, getDbStatus };