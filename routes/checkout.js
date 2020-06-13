const express = require('express');
const router = express.Router();
const pool = require('../db');
router.post('/', async (req, res) => {
  try {
    const {email, contactNum, address, city, postalCode} = req.body;
    console.log(email, contactNum, address, city, postalCode);
    const date = new Date();
    let dayNow = date.getDate();
    let monthNow = date.getMonth();
    let yearNow = date.getFullYear();
    let id_1 = 0;
    const orderInsert = await pool.query(
      'INSERT INTO orders (customer_email,address,city,postal_code, contact_num,ordered_date) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
      [
        email,
        address,
        city,
        postalCode,
        contactNum,
        `${dayNow}-${monthNow}-${yearNow}`,
      ]
    );
    id_1 = orderInsert.rows[0].id;

    const getFromCart = await pool.query(
      'SELECT order_id,product_id,quantity FROM cart WHERE customer_email = $1',
      [email]
    );

    getFromCart.rows.map(async cartItem => {
      const orderDetailsInsert = await pool.query(
        'INSERT INTO order_details (id,order_id,customer_email,product_id) VALUES ($1,$2,$3,$4)',
        [id_1, cartItem.order_id, email, cartItem.product_id]
      );

      const decrementStock = await pool.query(
        'UPDATE product SET stock = stock - $1 WHERE id = $2',
        [cartItem.quantity, cartItem.product_id]
      );
    });

    const deleteFromCart = await pool.query(
      'DELETE FROM cart where customer_email = $1',
      [email]
    );

    res.json(`Order Confirmed.Order ID: ${id_1}`);
  } catch (error) {
    console.error(error);
    res.json('Error in Checkout');
  }
});

module.exports = router;
