const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
  try {
    const {name, description, stock, pictureLink, price, categoryID} = req.body;
    console.log(name, description, stock, pictureLink, price, categoryID);
    const order = await pool.query(
      'INSERT INTO product (name,description,stock,picture_link, price, category_id) VALUES ($1,$2,$3,$4,$5,$6)',
      [name, description, stock, pictureLink, price, categoryID]
    );

    res.json('Product Added');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error in Posting Product');
  }
});

module.exports = router;
