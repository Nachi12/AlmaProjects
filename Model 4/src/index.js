const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./connector");
const cors = require("cors");

const app = express();

// ✅ Enable CORS (important for APIs)
app.use(cors());

// ✅ Parse JSON and URL-encoded data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ✅ Define routes
app.get("/api/orders", (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  const isValidLimit = Number.isInteger(limit) && limit > 0;
  const isValidOffset = Number.isInteger(offset) && offset >= 0;

  const finalLimit = isValidLimit ? limit : 10;
  const finalOffset = isValidOffset ? offset : 0;

  const query = "SELECT * FROM orders LIMIT ? OFFSET ?";
  connection.query(query, [finalLimit, finalOffset], (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).json(results);
  });
});

// ✅ (Optional) Root route to verify deployment
app.get("/", (req, res) => {
  res.send("✅ Express + MySQL API is running on Vercel!");
});

// ❌ Remove app.listen()
// ✅ Export app for Vercel serverless function
module.exports = app;
