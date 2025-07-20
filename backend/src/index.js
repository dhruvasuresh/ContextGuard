require('dotenv').config();
const { pgPool, connectMongo } = require('./db');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const employeeRoutes = require('./routes/employees');
app.use('/api/employees', employeeRoutes);

const policyRoutes = require('./routes/policies');
app.use('/api/policies', policyRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running!' });
});

const PORT = process.env.PORT || 5000;
// Test PostgreSQL connection
pgPool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('PostgreSQL connection error:', err));

// Connect to MongoDB
connectMongo();
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});