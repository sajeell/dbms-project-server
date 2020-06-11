'use strict';
const pool = require('./db');

async function check() {
  try {
    const deleteDressDetails = await pool.query(
      'SELECT product.category_id FROM cart JOIN product ON cart.product_id=product.id'
    );

    const category_id = deleteDressDetails.rows[0].category_id;

    if (category_id === 1) {
      console.log('its one');
    }
    console.log(category_id);
    return;
  } catch (error) {
    console.error(error);
  }
}

check();
