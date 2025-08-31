// server/index.js

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// A simple test route to make sure the server is working
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Plastic+ API! Server is running.' });
});
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/pickups', require('./routes/pickups'));
app.use('/api/chatbot', require('./routes/chatbot'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});