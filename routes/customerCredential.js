const router = require('express').Router();
const authorize = require('../middleware/authorize');
const pool = require('../db');

router.post('/', authorize, async (req, res) => {
  try {
    const customer = await pool.query(
      'SELECT * FROM customer WHERE email = $1',
      [req.customer.email]
    );

    res.json(customer.rows);
  } catch (err) {
    console.error(err.message);
    console.error('Error in getting credentials');
    res.status(500).send('Server error');
  }
});

module.exports = router;
