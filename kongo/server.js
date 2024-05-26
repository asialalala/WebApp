// import { AuthTypes, Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector'
 
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

// const connector = new Connector();
// const options = await connector.getOptions( {
//   instanceConnectionName: '',
//   ipType: IpAddressTypes.PUBLIC,
//   auhType: AuthTypes.PASSWORD
// });

/* 
* Use this client when you want to add or upadte something in database
* Conection to bazydanych2024
*/
const pool = new Pool({
  user: 'postgres',
  host: '34.132.191.171',
  database: 'hotel',
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
  database: 'hotel',
  password: 'BazyDanych2024',
  port: 5432,
})

pool.connect(function(err) {
  if (err) throw err;
  console.log("bazydanych2024 CONNECTED!");
});

repl.connect(function(err) {
  if (err) throw err;
  console.log("bazydanych2024-replica CONNECTED!");
});



app.use(bodyParser.json());

// Defining API endpoints
app.get('/booking', (req, res) => {
    const mail = req.query.mail;
    console.log("Trying to get bookings");
    console.log(mail);

    repl.query('SELECT booking.booking_id, booking.start_date, booking.end_date, booking.valid, room.queen_bed_num, room.single_bed_num, mail FROM booking JOIN booking_room ON booking.booking_id=booking_room.booking_id JOIN room ON room.room_id=booking_room.room_id JOIN customer ON booking.customer_id=customer.customer_id WHERE customer.mail=$1;',[mail] ,(err, result) => {
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
  
// TO DO! add specific query where standard, number of beds, price are defined it can be served with if's
// primary idea: SELECT room.room_id, room.queen_bed_num, room.single_bed_num, room.standard, booking_room.booking_id, booking.start_date, booking.end_date FROM room LEFT JOIN booking_room ON booking_room.room_id=room.room_id LEFT JOIN booking ON booking_room.booking_id=booking.booking_id where (start_date > \'$2\' OR end_date < \'$1\') OR  booking_room.room_id IS NULL ;
app.get('/find', (req, res) => {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  console.log("Trying to find rooms");
  console.log(startDate);
  console.log(endDate);

  repl.query('SELECT room.room_id, room.queen_bed_num, room.single_bed_num, room.standard FROM room LEFT JOIN booking_room ON booking_room.room_id=room.room_id LEFT JOIN booking ON booking_room.booking_id=booking.booking_id where (start_date > $2 OR end_date < $1) OR  booking_room.room_id IS NULL  GROUP BY room.room_id ORDER BY room.room_id ;', [startDate, endDate],(err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(result.rows);
      console.log(result);
    }
  });
});

function IsNewCustomer(req, res, next) {

}

// Add customer
app.put('/customer', (req, res) => {
  const { firstName, lastName, email, phoneNumber } = req.body;

  console.log("Trying to add customer");
  console.log(firstName);
  console.log(lastName);
  console.log(email);
  console.log(phoneNumber);

  console.log(res.statusCode);

  repl.query('SELECT mail FROM customer WHERE mail LIKE $1', [email], (err, check) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (check.rows.length === 0) {
      res.status(110); // new customer 
      console.log("New customer", check.rowCount);
    } else { 
      res.status(111); // already in DB
    }
  });

  if(res.statusCode === 110) {
  pool.query('INSERT INTO customer (first_name, last_name, mail, phone) VALUES ($1, $2, $3, $4) RETURNING *', [firstName, lastName, email, phoneNumber], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (result.rows.length === 0) {
      res.status(404).json({ error: 'Item not found' });
    } else {
      res.json(result.rows[0]);
    }
  });
} else console.log("Not added - already in DB");

}
);
