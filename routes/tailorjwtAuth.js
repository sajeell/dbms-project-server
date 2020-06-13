const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db');
const validInfo = require('../middleware/validInfo');
const jwtGenerator = require('../utils/tailorjwtGenerator');
const authorize = require('../middleware/tailorAuthorize');

router.post('/register', validInfo, async (req, res) => {
  const {email, name, password} = req.body;

  try {
    const user = await pool.query('SELECT * FROM tailor WHERE email = $1', [
      email,
    ]);

    if (user.rows.length > 0) {
      return res.status(401).json('Tailor already exists!');
    }

    const salt = await bcrypt.genSalt(7);
    const bcryptPassword = await bcrypt.hash(password, salt);

    let newUser = await pool.query(
      'INSERT INTO tailor (name,email,password) VALUES ($1,$2, $3) RETURNING *',
      [name, email, bcryptPassword]
    );

    const tailorjwtToken = jwtGenerator(newUser.rows[0].email);

    return res.json({tailorjwtToken});
  } catch (err) {
    console.error(err);
    res.status(500).send('Error in registering tailor');
  }
});

router.post('/login', validInfo, async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await pool.query('SELECT * FROM tailor WHERE email = $1', [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json('Invalid Credential');
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).json('Invalid Credential');
    }
    const tailorjwtToken = jwtGenerator(user.rows[0].email);
    return res.json({tailorjwtToken});
  } catch (err) {
    console.error(err);
    res.status(500).send('Error in tailor login');
  }
});

router.post('/verify', authorize, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error in tailor verification');
  }
});

module.exports = router;
