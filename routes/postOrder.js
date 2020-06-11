const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/women', async (req, res) => {
  try {
    const {
      ema,
      product_id,
      shoulder,
      chest,
      price,
      waist,
      sleevesLength,
      sleevesOpening,
      armHole,
      shirtLength,
      daman,
      trouserWaist,
      trouserFly,
      trouserLength,
      trouserThy,
      trouserHip,
      trouserBottom,
      trouserKnee,
      other,
      quantity,
    } = req.body;

    const order = await pool.query(
      'INSERT INTO women_dress (customer_email,product_id,quantity, price, shoulder,chest,waist,sleeves_length,sleeves_opening,arm_hole,shirt_length,daman,trouser_waist,trouser_fly,trouser_length, trouser_hip, trouser_thy,trouser_bottom, trouser_knee,other) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20) RETURNING order_id;',
      [
        ema,
        product_id,
        quantity,
        price,
        shoulder,
        chest,
        waist,
        sleevesLength,
        sleevesOpening,
        armHole,
        shirtLength,
        daman,
        trouserWaist,
        trouserFly,
        trouserLength,
        trouserHip,
        trouserThy,
        trouserBottom,
        trouserKnee,
        other,
      ]
    );
    // const orderIDResponse = await pool.query(
    //   'SELECT order_id FROM women_dress WHERE customer_email = $1 AND product_id = $2;',
    //   [email, product_id]
    // );

    const order_id = order.rows[0].order_id;

    const cart = await pool.query(
      'INSERT INTO cart (order_id,customer_email,quantity, price,product_id) VALUES ($1,$2,$3,$4,$5);',
      [order_id, ema, quantity, price, product_id]
    );

    res.json({msg: 'Order Created'});
  } catch (err) {
    console.error(err);
    res.status(500).send('Error in Posting Women Order');
  }
});

module.exports = router;
