const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.json());
app.use(express.static('public')); // serve frontend files

// Connect to MySQL (use environment variables for deployment)
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Test connection
db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Route to register user
app.post('/users', (req, res) => {
  const { name, email, password } = req.body;
  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error registering user');
    } else {
      res.send('User registered successfully');
    }
  });
});

// Route to get all services
app.get('/services', (req, res) => {
  db.query('SELECT * FROM services', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching services');
    } else {
      res.json(results);
    }
  });
});

// Route to create a booking
app.post('/bookings', (req, res) => {
  const { user_id, service_id, booking_date } = req.body;
  const sql = 'INSERT INTO bookings (user_id, service_id, booking_date) VALUES (?, ?, ?)';
  db.query(sql, [user_id, service_id, booking_date], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error creating booking');
    } else {
      res.send('Booking successful');
    }
  });
});

// Start server (flexible port for deployment)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
