// import { AuthTypes, Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector'
process.env.GOOGLE_APPLICATION_CREDENTIALS = '../../sonic-shuttle-CR.json';

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

const { AuthTypes, Connector, IpAddressTypes } = require('@google-cloud/cloud-sql-connector')

// TLS connection
const connectorPool = new Connector();
const optionsPool = connectorPool.getOptions({
  instanceConnectionName: 'sonic-shuttle-425013-m4:us-central1:baza-danych-hotel',
  ipType: IpAddressTypes.PUBLIC,
  auhType: AuthTypes.PASSWORD
});

const connectorRepl = new Connector();
const optionsRepl = connectorRepl.getOptions({
  instanceConnectionName: 'sonic-shuttle-425013-m4:us-central1:baza-danych-hotel-replica',
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
  ...optionsPool
})

/* 
* Use this client when you want to read something from database
* Conection to bazydanych2024-replica
*/
const repl = new Pool({
  user: 'postgres',
  host: '104.198.155.171',
  database: 'Hotel',
  password: 'BazyDanych2024',
  port: 5432,
  ...optionsRepl
})

pool.connect(function (err) {
  if (err) throw err;
  console.log("bazydanych2024 CONNECTED!");
});

repl.connect(function (err) {
  if (err) throw err;
  console.log("bazydanych2024-replica CONNECTED!");
});



app.use(bodyParser.json());


// SQL incjectios 
const { escape } = require('sqlstring'); // How does it work? -> https://www.npmjs.com/package/sqlstring
const allowedSortOptions = ["Price (lowest first)", "Price (highest first)", ""];

// Defining API endpoints
app.get('/booking', (req, res) => {
  const mail = req.query.mail;
  console.log("Trying to get bookings");
  console.log(mail);

  // Check if string and if it is not null
  if (
    typeof mail !== 'string' ||
    !mail.trim()
  ) {
    return res.status(400).json({ error: 'Invalid input data' });
  }
  // Data escaping
  const mailE = escape(mail);


  pool.query('SELECT booking.booking_id, booking.start_date, booking.end_date, booking.validation, room.queen_bed_num, room.single_bed_num, mail FROM booking JOIN booking_room ON booking.booking_id=booking_room.booking_id JOIN room ON room.room_id=booking_room.room_id JOIN customer ON booking.customer_id=customer.customer_id WHERE customer.mail=$1;', [mailE], (err, result) => {
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

  // Check if number
  if (
    typeof id !== 'number' || id == 0
  ) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  pool.query('UPDATE booking SET validation=\'canceled\' WHERE booking_id=$1 RETURNING *', [id], (err, result) => {
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

// TO DO! add specific query where number of beds
app.get('/find', (req, res) => {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const sort = req.query.sort;
  console.log("Trying to find rooms");
  console.log(startDate);
  console.log(endDate);
  console.log(sort);

  // Check if sort is specifed correctly
  if (!allowedSortOptions.includes(sort)) {
    return res.status(400).json({ error: 'Invalid sort option' });
  }

  // Chose type of query inluding sort type
  if (sort === "Price (lowest first)") {
    orderClause = 'ORDER BY room.price ASC';
  } else if (sort === "Price (highest first)") {
    orderClause = 'ORDER BY room.price DESC';
  } else {
    orderClause = 'ORDER BY room.room_id ASC';
  }

  const query = `
    SELECT room.room_id, room.queen_bed_num, room.single_bed_num, room.standard, room.price 
    FROM room 
    LEFT JOIN booking_room ON booking_room.room_id = room.room_id 
    LEFT JOIN booking ON booking_room.booking_id = booking.booking_id 
    WHERE (start_date > $2 OR end_date < $1) OR booking_room.room_id IS NULL 
    GROUP BY room.room_id 
    ${orderClause};`;

  pool.query(query, [startDate, endDate], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(result.rows);
      console.log(result);
    }
  });

});

// Add customer if doesnt exist in database
app.put('/customer', (req, res) => {
  const { firstName, lastName, email, phoneNumber } = req.body;

  console.log("Trying to add customer");
  console.log(firstName);
  console.log(lastName);
  console.log(email);
  console.log("Before checkoing and escaping: ", firstName);

  // Check if string and if not null
  if (
    typeof firstName !== 'string' ||
    typeof lastName !== 'string' ||
    typeof email !== 'string' ||
    typeof phoneNumber !== 'string' ||
    !firstName.trim() ||
    !lastName.trim() ||
    !email.trim() ||
    !phoneNumber.trim()
  ) {
    return res.status(400).json({ error: 'Invalid input data' });
  }
  console.log("After checking, before escaping: ", firstName);

  // Data escaping 
  const firstNameE = escape(firstName);
  const lastNameE = escape(lastName);
  const emailE = escape(email);
  // const phoneNumberE = escape(phoneNumber); It doesnt work but data base varifies that string
  console.log("After escaping: ", firstNameE);

  pool.query('BEGIN', (beginErr) => {
    if (beginErr) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      pool.query('SELECT mail FROM customer WHERE mail LIKE $1', [emailE], (err, check) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else if (check.rows.length === 0) {
          pool.query('INSERT INTO customer (first_name, last_name, mail, phone) VALUES ($1, $2, $3, $4) RETURNING *', [firstNameE, lastNameE, emailE, phoneNumber], (insertErr, result) => {
            if (insertErr) {
              console.error('Error executing query:', insertErr);
              res.status(500).json({ error: 'Internal Server Error' });
            } else {
              pool.query('COMMIT', (commitErr) => {
                if (commitErr) {
                  console.error('Error executing query:', insertErr);
                  res.status(500).json({ error: 'Internal Server Error' });
                } else {
                  console.log('Commited.');
                  res.status(201).json(result.rows[0]); // 201 Created 
                }
              });
            }
          });
        } else {
          pool.query('COMMIT', (commitErr) => {
            if (commitErr) {
              console.error('Error executing query:', insertErr);
              res.status(500).json({ error: 'Internal Server Error' });
            } else {
              res.status(200).json({ message: 'Customer already exists', customer: check.rows[0] }); // 200 OK with customer info
              console.log("Not added - already in DB");
            }
          });

        }
      })
    }
  });

  //end
});

// Add booking, contains adding to booking and booking_room
app.put('/bookRooms', (req, res) => {
  const { email, startDate, endDate, rooms, price } = req.body;

  console.log("Trying to add booking");
  console.log(email);
  console.log(startDate);
  console.log(endDate);
  console.log(rooms);

  // Check if correct data type
  if (
    typeof email !== 'string' ||
    typeof startDate !== 'string' ||
    typeof endDate !== 'string' ||
    !Array.isArray(rooms) ||
    rooms.some(room => typeof room !== 'number')
  ) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  // Data escaping 
  const startDateE = escape(startDate);
  const endDateE = escape(endDate);
  const emailE = escape(email);

  pool.query('BEGIN', (beginErr) => {
    if (beginErr) {
      console.error('Error executing query BEGIN:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    } else {

  // find customer id
  pool.query('SELECT customer_id FROM customer WHERE mail = $1', [emailE], (err, result) => { // Using '=' instead of 'LIKE'
    if (err) {
      console.error('Error executing query SELECT customer:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('Result length:', result.rows.length);
      if (result.rows.length != 0) {
        const customerID = result.rows[0].customer_id; // assuming customer_id is the column name
        const comment = "-";
        const valid = "pending";
        // pool.query('SELECT * FROM hotele WHERE name like "' + hotel_name + "' ")   <--- w taki sposob dla sql injection
        // Insert booking into bookings table
        pool.query('INSERT INTO booking (start_date, end_date, customer_id, comment, validation, price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING booking_id',
          [startDateE, endDateE, customerID, comment, valid, price],
          (insertErr, insertResult) => {
            if (insertErr) {
              console.error('Error executing insert query INSERT INTO booking:', insertErr);
              return res.status(500).json({ error: 'Internal Server Error' });
            } else {
              const bookingId = insertResult.rows[0].booking_id;
              console.log("booking_id: ", bookingId);
              
              tmp = "";
              insertQ = "INSERT INTO booking_room VALUES ";

              for (i = 0; i < rooms.length; i++) {
                tmp = `(${bookingId}, ${rooms[i]})`;
                insertQ += tmp;
                if (i != rooms.length - 1) insertQ += ", ";
              }
              insertQ += " RETURNING *";
              console.log("Query: ", insertQ);
                  pool.query(insertQ, (err, result) => {
                    if (err) {
                      pool.query('ROLLBACK', (comErr) => {
                        if(comErr) {
                          console.error('Error executing query ROLLBACK:', comErr);
                          return res.status(500).json({ error: 'Internal Server Error' }); 
                        } else {
                          console.error('Error during booking room insertion:', comErr);
                          res.status(500).json({ error: comErr });
                        }
                      });
                    } else if (result.rows.length === 0) {
                      pool.query('ROLLBACK', (comErr) => {
                        if(comErr) {
                          console.error('Error executing query ROLLBACK:', comErr);
                          return res.status(500).json({ error: 'Internal Server Error' }); 
                        } else {
                          console.error('Error during booking room insertion:', comErr);
                          res.status(500).json({ error: comErr });
                        }
                      });
              } else {
                console.log(result);
                pool.query('COMMIT', (comErr) => {
                  if(comErr) {
                    console.error('Error executing query COMMIT:', comErr);
                    return res.status(500).json({ error: 'Internal Server Error' }); 
                  } else {
                    console.log("Added to booking_room");
                    res.status(200).json({ message: 'Booking successful', booking_id: bookingId });
                  }
                });
              }
            });
        
                  
            }
          });
      } else {
        res.status(404).json({ error: 'Customer not found' });
      }
    }
  });

    } //begin else

});
});

// Removing all rows from temporary table
// In order to remove all rows: " input; DELETE FROM temp"
app.get('/injection', (req, res) => {
  const input = req.query.input;
  console.log("Trying to get info from temporary table");
  console.log(input);

  query = 'SELECT * FROM temp WHERE a=' + input + ';';
  console.log("Query: ", query);

  pool.query(query, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(result.rows);
      console.log(result);
    }
  });
});