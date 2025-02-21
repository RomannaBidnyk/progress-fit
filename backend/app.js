const express = require('express');
const cors = require('cors');
const router = express.Router();
const dotenv = require('dotenv');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.send('Welcome to the ProgressFit backend');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`);
});