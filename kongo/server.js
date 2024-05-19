// creates a simple Express server that listens on port 3000
const express = require('express');
const app = express();

const port = process.env.PORT || 4000;
const bodyParser = require('body-parser');

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Establishing a connection to PostgreSQL
const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: '34.132.191.171',
  database: 'hotel',
  password: 'BazyDanych2024',
  port: 5432,
})
pool.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.use(bodyParser.json());

// Defining API endpoints
app.get('/booking', (req, res) => {
    const mail = req.query.mail;
    console.log("Trying to get bookings");
    console.log(mail);

    pool.query('SELECT booking.booking_id, booking.start_date, booking.end_date, booking.valid, room.queen_bed_num, room.single_bed_num, mail FROM booking JOIN booking_room ON booking.booking_id=booking_room.booking_id JOIN room ON room.room_id=booking_room.room_id JOIN customer ON booking.customer_id=customer.customer_id WHERE customer.mail=$1;',[mail] ,(err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(result.rows);
        console.log(result);
      }
    });
  });

  app.put('/canceling/:id', (req, res) => {
    const { id } = req.params;
    console.log("Trying to cancel");
    console.log(id);

    pool.query('UPDATE booking SET valid=\'canceled\' WHERE booking_id=$1 RETURNING *',[id],(err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else if (result.rows.length === 0) {
        res.status(404).json({ error: 'Item not found' });
      } else {
        res.json(result.rows[0]);
      }
    }
  );
});


  
//   app.post('api/booking', (req, res) => {
//     const { name, description } = req.body;
//     console.log("Tying to post!");
//     pool.query(
//       'INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *',
//       [name, description],
//       (err, result) => {
//         if (err) {
//           console.error('Error executing query:', err);
//           res.status(500).json({ error: 'Internal Server Error' });
//         } else {
//           res.json(result.rows[0]);
//         }
//       }
//     );
//   });

// //   Implementing CRUD operations
// // Create Read Update Delete

// app.put('api/booking:id', (req, res) => {
//     const { id } = req.params;
//     const { name, description } = req.body;
//     console.log("Tying to put!");

//     pool.query(
//       'UPDATE items SET name = $1, description = $2 WHERE id = $3 RETURNING *',
//       [name, description, id],
//       (err, result) => {
//         if (err) {
//           console.error('Error executing query:', err);
//           res.status(500).json({ error: 'Internal Server Error' });
//         } else if (result.rows.length === 0) {
//           res.status(404).json({ error: 'Item not found' });
//         } else {
//           res.json(result.rows[0]);
//         }
//       }
//     );
//   });
  
//   app.delete('api/booking:id', (req, res) => {
//     const { id } = req.params;
//     console.log("Tying to delete!");

//     pool.query(
//       'DELETE FROM items WHERE id = $1 RETURNING *',
//       [id],
//       (err, result) => {
//         if (err) {
//           console.error('Error executing query:', err);
//           res.status(500).json({ error: 'Internal Server Error' });
//         } else if (result.rows.length === 0) {
//           res.status(404).json({ error: 'Item not found' });
//         } else {
//           res.json(result.rows[0]);
//         }
//       }
//     );
//   });