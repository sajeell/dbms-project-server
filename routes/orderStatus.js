const express = require('express');
const router = express.Router();
const pool = require('../db');

router.put('/stiched/:id', async (req, res) => {
  try {
    const stitched = await pool.query(
      "UPDATE orders SET status = 'stitched' WHERE id = $1 ",
      [req.params.id]
    );

    res.json('Product Status Changed to stitched');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error in changing status of product to stitched');
  }
});

router.put('/delivered/:id', async (req, res) => {
  try {
    const delivered = await pool.query(
      "UPDATE orders SET status = 'delivered' WHERE id = $1 ",
      [req.params.id]
    );
    const date = new Date();
    let dayNow = date.getDate();
    let monthNow = date.getMonth();
    let yearNow = date.getFullYear();
    const updateDate = await pool.query(
      'UPDATE orders SET delivered_date = $1 WHERE id = $2 ',
      [`${dayNow}-${monthNow}-${yearNow}`, req.params.id]
    );

    const deliveredDressID = await pool.query(
      'SELECT order_id, product_id FROM order_details WHERE id = $1',
      [req.params.id]
    );

    deliveredDressID.rows.map(async item => {
      const deliveredCategoryID = await pool.query(
        'SELECT category_id FROM product WHERE id = $1',
        [item.product_id]
      );

      deliveredCategoryID.rows.map(async categoryID => {
        if (categoryID.category_id == '1') {
          await pool.query('DELETE FROM women_dress WHERE order_id = $1', [
            item.order_id,
          ]);
        } else if (categoryID.category_id == '2') {
          await pool.query('DELETE FROM kid_dress WHERE order_id = $1', [
            item.order_id,
          ]);
        } else if (categoryID.category_id == '3') {
          await pool.query('DELETE FROM suit_dress WHERE order_id = $1', [
            item.order_id,
          ]);
        } else if (categoryID.category_id == '4') {
          await pool.query('DELETE FROM men_dress WHERE order_id = $1', [
            item.order_id,
          ]);
        }
      });
    });
    const deleteDelivered = await pool.query(
      'DELETE FROM order_details WHERE id = $1',
      [req.params.id]
    );
    res.json('Product Status Changed to delivered');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error in changing status of product to delivered');
  }
});

module.exports = router;
