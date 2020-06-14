const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const category = await pool.query('SELECT * FROM orders');
    res.json(category.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error in getting all orders');
  }
});

router.get('/stitched', async (req, res) => {
  try {
    const category = await pool.query(
      "SELECT * FROM orders WHERE status = 'stitched'"
    );

    res.json(category.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error in getting stitched orders');
  }
});

router.get('/delivered', async (req, res) => {
  try {
    const category = await pool.query(
      "SELECT * FROM orders WHERE status = 'delivered' ",
      [id]
    );

    res.json(category.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error in getting category');
  }
});

router.get('/customer/:email', async (req, res) => {
  try {
    const category = await pool.query(
      'SELECT * orders WHERE customer_email = $1',
      [req.params.email]
    );

    res.json(category.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error in getting customer orders');
  }
});

module.exports = router;
