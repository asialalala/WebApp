// creates a simple Express server that listens on port 3000
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Establishing a connection to PostgreSQL
const { Client } = require('pg')
const client = new Client({
  user: 'postgres',
  host: '34.132.191.171',
  database: 'hotel',
  password: 'BazyDanych2024',
  port: 5432,
})
client.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

// Defining API endpoints
app.get('/api/items', (req, res) => {
    pool.query('SELECT * FROM items', (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(result.rows);
      }
    });
  });
  
  app.post('/api/items', (req, res) => {
    const { name, description } = req.body;
  
    pool.query(
      'INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *',
      [name, description],
      (err, result) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json(result.rows[0]);
        }
      }
    );
  });

//   Implementing CRUD operations
// Create Read Update Delete

app.put('/api/items/:id', (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
  
    pool.query(
      'UPDATE items SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, id],
      (err, result) => {
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
  
  app.delete('/api/items/:id', (req, res) => {
    const { id } = req.params;
  
    pool.query(
      'DELETE FROM items WHERE id = $1 RETURNING *',
      [id],
      (err, result) => {
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