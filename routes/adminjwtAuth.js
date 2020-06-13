const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db');
const validInfo = require('../middleware/validInfo');
const jwtGenerator = require('../utils/adminjwtGenerator');
const authorize = require('../middleware/adminAuthorize');

router.post('/register', validInfo, async (req, res) => {
  const {email, name, password} = req.body;

  try {
    const user = await pool.query('SELECT * FROM admin WHERE email = $1', [
      email,
    ]);

    if (user.rows.length > 0) {
      return res.status(401).json('Admin already exists!');
    }

    const salt = await bcrypt.genSalt(9);
    const bcryptPassword = await bcrypt.hash(password, salt);

    let newUser = await pool.query(
      'INSERT INTO admin (name,email,password) VALUES ($1,$2, $3) RETURNING *',
      [name, email, bcryptPassword]
    );

    const adminjwtToken = jwtGenerator(newUser.rows[0].email);

    return res.json({adminjwtToken});
  } catch (err) {
    console.error(err);
    res.status(500).send('Error in registering admin');
  }
});

router.post('/login', validInfo, async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await pool.query('SELECT * FROM admin WHERE email = $1', [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json('Invalid Credential');
    }
    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).json('Invalid Credential');
    }
    const adminjwtToken = jwtGenerator(user.rows[0].email);
    return res.json({adminjwtToken});
  } catch (err) {
    console.error(err);
    res.status(500).send('Error in admin login');
  }
});

router.post('/verify', authorize, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error in admin verification');
  }
});

module.exports = router;
