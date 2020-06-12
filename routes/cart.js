'use strict';
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/:email', async (req, res) => {
  try {
    const email = req.params.email;
    console.log(`Email::: ${email}`);
    const cart = await pool.query(
      'SELECT * FROM cart JOIN product ON cart.product_id=product.id WHERE customer_email = $1',
      [email]
    );
    res.json(cart.rows);
  } catch (error) {
    console.error(error);
    console.error('Error in getting cart items');
  }
});

router.post('/', async (req, res) => {
  try {
    const {order_id, customer_email, quantity, price} = req.body;
    const cart = await pool.query(
      'INSERT INTO cart (order_id, customer_email, quantity, price) VALUES ($1,$2,$3,$4);',
      [order_id, customer_email, quantity, price]
    );

    res.json({msg: 'Succesfully added into cart'});
  } catch (err) {
    console.error(err);
    res.status(500).send('Error in Posting Cart Item');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    let category_id;
    const deleteDressDetails = await pool.query(
      'SELECT product.category_id FROM cart JOIN product ON cart.product_id=product.id'
    );

    category_id = deleteDressDetails.rows[0].category_id;

    if (category_id == 1) {
      const deleteWomenDress = await pool.query(
        'DELETE FROM women_dress WHERE order_id = $1',
        [id]
      );
    }

    const deleteCartItem = await pool.query(
      'DELETE FROM cart WHERE order_id = $1',
      [id]
    );
    res.json({msg: 'Succesfully deleted from cart'});
  } catch (error) {
    console.error(error);
    res.status(500).send('Error in deleting cart item');
  }
});

module.exports = router;
