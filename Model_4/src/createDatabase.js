let con = require('./connector');
let data = require('./data');

let a = async () => {
  try {
    await new Promise((resolve, reject) => {
      con.query('DROP TABLE IF EXISTS orders', (err) => {
        if (err) reject(err);
        else resolve(1);
      });
    });

    await new Promise((resolve, reject) => {
      con.query('CREATE TABLE orders (_id varchar(200), title varchar(100), description varchar(1000))', (err) => {
        if (err) reject(err);
        else resolve(1);
      });
    });

    for (let i = 0; i < data.length; i++) {
      await new Promise((resolve, reject) => {
        con.query(
          `INSERT INTO orders VALUES (?, ?, ?)`,
          [data[i]._id, data[i].title, data[i].description],
          (err) => {
            if (err) reject(err);
            else resolve(1);
          }
        );
      });
    }

    const [error, results] = await new Promise((resolve, reject) => {
      con.query('SELECT * FROM orders', (err, results) => {
        if (err) reject([err, undefined]);
        else resolve([undefined, results]);
      });
    });

    if (error) {
      console.log('Error fetching orders:', error);
    } else {
      console.log('Database and table created with sample data! Rows inserted:', results.length);
    }
  } catch (err) {
    console.log('failed to connect to mysql server/database or execute queries', err);
  } finally {
    con.end(); // Close the connection
  }
};

a();