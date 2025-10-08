const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./connector');
const cors = require('cors'); // Must be installed

const port = 8080;

// Enable CORS for all origins (development setting)
app.use(cors()); // Place this before other middleware

// Parse JSON bodies and URL-encoded data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Endpoint for /api/orders with pagination
app.get('/api/orders', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  const isValidLimit = Number.isInteger(limit) && limit > 0;
  const isValidOffset = Number.isInteger(offset) && offset >= 0;

  const finalLimit = isValidLimit ? limit : 10;
  const finalOffset = isValidOffset ? offset : 0;

  const query = 'SELECT * FROM orders LIMIT ? OFFSET ?';
  connection.query(query, [finalLimit, finalOffset], (err, results) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(200).json(results);
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});

module.exports = app;
