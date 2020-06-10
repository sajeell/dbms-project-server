const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const product = await pool.query(
      'SELECT * FROM product WHERE category_id = $1',
      [id]
    );

    res.json(product.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error in getting product');
  }
});

module.exports = router;
