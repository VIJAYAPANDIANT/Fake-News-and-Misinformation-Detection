const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 2000, // Fail fast if MongoDB is offline or blocked
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.useMockDb = false;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.log('--- FALLING BACK TO IN-MEMORY MOCK DATABASE ---');
    global.useMockDb = true;
    
    // In Vercel serverless environments we must not call process.exit(1)
    if (!process.env.VERCEL) {
      console.log('Server running with Mock database fallback.');
    }
  }
};

module.exports = connectDB;
