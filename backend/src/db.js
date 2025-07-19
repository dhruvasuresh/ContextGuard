// backend/src/db.js
console.log('POSTGRES_URI:', process.env.POSTGRES_URI);
const { Pool } = require('pg');
const mongoose = require('mongoose');

const pgPool = new Pool({
  connectionString: process.env.POSTGRES_URI,
});

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // user: process.env.MONGO_USER, // optional, if using auth
      // pass: process.env.MONGO_PASS, // optional, if using auth
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

module.exports = { pgPool, connectMongo };