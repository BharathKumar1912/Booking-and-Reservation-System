const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // serves your frontend files

// ✅ Define MySQL connection using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// ✅ Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// ✅ Routes

// Register a user
app.post('/users', (req, res) => {
  const { name, email, password } = req.body;
  db.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: 'User registered successfully', id: result.insertId });
    }
  );
});

// Get all services (rooms)
app.get('/services', (req, res) => {
  db.query('SELECT * FROM services', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Book a service (room)
app.post('/bookings', (req, res) => {
  const { user_id, service_id, booking_date } = req.body;
  db.query(
    'INSERT INTO bookings (user_id, service_id, booking_date) VALUES (?, ?, ?)',
    [user_id, service_id, booking_date],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: 'Booking successful', id: result.insertId });
    }
  );
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
