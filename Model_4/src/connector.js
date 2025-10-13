// const mysql = require('mysql2');
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'NewPassword@9380', 
//   database: 'zomato_db' 
// });

// connection.connect((err) => {
//   if (err) {
//     console.error('failed to connect to mysql server/database', err);
//     return;
//   }
//   console.log('Connected to MySQL database');
// });

// module.exports = connection;


// connector.js
const mysql = require('mysql2');

// Create a connection pool instead of a single connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,       // e.g. 'sql12.freemysqlhosting.net'
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,  // Adjust if needed
  queueLimit: 0
});

// Export the pool for queries
module.exports = pool;
