const express = require('express'); 
const aiRoutes = require('./routes/ai.routes');
const app = express(); 
const cors = require('cors');
require('dotenv').config();
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/ai', aiRoutes);



module.exports = app;