const router = require('express').Router();
const authorize = require('../middleware/authorize');
const pool = require('../db');

router.post('/:id', authorize, async (req, res) => {
  try {
    const customer = await pool.query('SELECT * FROM admin WHERE id = $1', [
      req.params.id,
    ]);

    res.json(customer.rows);
  } catch (err) {
    console.error(err.message);
    console.error('Error in getting admin credentials');
    res.status(500).send('Server error');
  }
});

module.exports = router;
