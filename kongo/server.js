import { AuthTypes, Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector'

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

const connector = new Connector();
const options = await connector.getOptions( {
instanceConnectionName: '',
ipType: IpAddressTypes.PUBLIC,
auhType: AuthTypes.PASSWORD
});

/* 
* Use this client when you want to add or upadte something in database
* Conection to bazydanych2024
*/
const pool = new Pool({
  user: 'postgres',
  host: '34.172.182.207',
  database: 'Hotel',
  password: 'BazyDanych2024',
  port: 5432,
})

/* 
* Use this client when you want to read something from database
* Conection to bazydanych2024-replica
*/
const repl = new Pool({
  user: 'postgres',
  host: '34.42.198.142',
  database: 'Hotel',
  password: 'BazyDanych2024',
  port: 5432,
})

pool.connect(function (err) {
  if (err) throw err;
  console.log("bazydanych2024 CONNECTED!");
});

// repl.connect(function (err) {
//   if (err) throw err;
//   console.log("bazydanych2024-replica CONNECTED!");
// });



app.use(bodyParser.json());

// Defining API endpoints
app.get('/booking', (req, res) => {
  const mail = req.query.mail;
  console.log("Trying to get bookings");
  console.log(mail);

  repl.query('SELECT booking.booking_id, booking.start_date, booking.end_date, booking.valid, room.queen_bed_num, room.single_bed_num, mail FROM booking JOIN booking_room ON booking.booking_id=booking_room.booking_id JOIN room ON room.room_id=booking_room.room_id JOIN customer ON booking.customer_id=customer.customer_id WHERE customer.mail=$1;', [mail], (err, result) => {
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

  pool.query('UPDATE booking SET valid=\'canceled\' WHERE booking_id=$1 RETURNING *', [id], (err, result) => {
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

// TO DO! add specific query where standard, number of beds, price are defined it can be served with if's
// primary idea: SELECT room.room_id, room.queen_bed_num, room.single_bed_num, room.standard, booking_room.booking_id, booking.start_date, booking.end_date FROM room LEFT JOIN booking_room ON booking_room.room_id=room.room_id LEFT JOIN booking ON booking_room.booking_id=booking.booking_id where (start_date > \'$2\' OR end_date < \'$1\') OR  booking_room.room_id IS NULL ;
app.get('/find', (req, res) => {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const sort = req.query.sort;
  console.log("Trying to find rooms");
  console.log(startDate);
  console.log(endDate);
  console.log(sort);

  if (sort == "Price (lowest first)") {
    console.log("Lowest price");

    console.log("Normal");
    pool.query('SELECT room.room_id, room.queen_bed_num, room.single_bed_num, room.standard, room.price FROM room LEFT JOIN booking_room ON booking_room.room_id=room.room_id LEFT JOIN booking ON booking_room.booking_id=booking.booking_id where (start_date > $2 OR end_date < $1) OR  booking_room.room_id IS NULL  GROUP BY room.room_id ORDER BY room.price ASC;', [startDate, endDate], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(result.rows);
        console.log(result);
      }
    });

  } else if (sort == "Price (highest first)") {
    console.log("Highest price");

    console.log("Normal");
    pool.query('SELECT room.room_id, room.queen_bed_num, room.single_bed_num, room.standard, room.price  FROM room LEFT JOIN booking_room ON booking_room.room_id=room.room_id LEFT JOIN booking ON booking_room.booking_id=booking.booking_id where (start_date > $2 OR end_date < $1) OR  booking_room.room_id IS NULL  GROUP BY room.room_id ORDER BY room.price DESC;', [startDate, endDate], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(result.rows);
        console.log(result);
      }
    });

  } else {
    console.log("Normal");
    pool.query('SELECT room.room_id, room.queen_bed_num, room.single_bed_num, room.standard, room.price  FROM room LEFT JOIN booking_room ON booking_room.room_id=room.room_id LEFT JOIN booking ON booking_room.booking_id=booking.booking_id where (start_date > $2 OR end_date < $1) OR  booking_room.room_id IS NULL  GROUP BY room.room_id ORDER BY room.room_id ;', [startDate, endDate], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(result.rows);
        console.log(result);
      }
    });
  }
});

// Add customer if doesnt exist in database
app.put('/customer', (req, res) => {
  const { firstName, lastName, email, phoneNumber } = req.body;

  console.log("Trying to add customer");
  console.log(firstName);
  console.log(lastName);
  console.log(email);
  console.log(phoneNumber);

  repl.query('SELECT mail FROM customer WHERE mail LIKE $1', [email], (err, check) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (check.rows.length === 0) {
      pool.query('INSERT INTO customer (first_name, last_name, mail, phone) VALUES ($1, $2, $3, $4) RETURNING *', [firstName, lastName, email, phoneNumber], (insertErr, result) => {
        if (insertErr) {
          console.error('Error executing query:', insertErr);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.status(201).json(result.rows[0]); // 201 Created
        }
      });
    } else {
      res.status(200).json({ message: 'Customer already exists', customer: check.rows[0] }); // 200 OK with customer info
      console.log("Not added - already in DB");
    }
  });
});

// Add booking, contains adding to booking and booking_room
app.put('/bookRooms', (req, res) => {
  const { email, startDate, endDate, rooms } = req.body;

  console.log("Trying to add booking");
  console.log(email);
  console.log(startDate);
  console.log(endDate);
  console.log(rooms);

  // find customer id
  repl.query('SELECT customer_id FROM customer WHERE mail = $1', [email], (err, result) => { // Using '=' instead of 'LIKE'
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('Result length:', result.rows.length);
      if (result.rows.length != 0) {
        const customerID = result.rows[0].customer_id; // assuming customer_id is the column name
        const price = '300$'; // temporary price
        const comment = "-";
        const valid = "pending";

        // Insert booking into bookings table
        pool.query('INSERT INTO booking (start_date, end_date, customer_id, comment, valid, price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING booking_id',
          [startDate, endDate, customerID, comment, valid, price],
          (insertErr, insertResult) => {
            if (insertErr) {
              console.error('Error executing insert query:', insertErr);
              return res.status(500).json({ error: 'Internal Server Error' });
            } else {
              const bookingId = insertResult.rows[0].booking_id;
              const bookingRoomPromises = [];

              for (let i = 0; i < rooms.length; i++) {
                console.log("Room ", rooms[i]);
                bookingRoomPromises.push(new Promise((resolve, reject) => {
                  pool.query('INSERT INTO booking_room (booking_id, room_id) VALUES ($1, $2) RETURNING *', [bookingId, rooms[i]], (err, result) => {
                    if (err) {
                      console.error('Error executing query:', err);
                      reject('Internal Server Error');
                    } else if (result.rows.length === 0) {
                      reject('Item not found');
                    } else {
                      resolve(result.rows[0]);
                    }
                  });
                }));
              }

              Promise.all(bookingRoomPromises)
                .then(results => {
                  console.log("Added to booking_room");
                  res.status(200).json({ message: 'Booking successful', booking_id: bookingId });
                })
                .catch(error => {
                  console.error('Error during booking room insertion:', error);
                  res.status(500).json({ error: error });
                });
            }
          }
        );
      } else {
        res.status(404).json({ error: 'Customer not found' });
      }
    }
  });
});