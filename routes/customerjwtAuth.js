const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const validInfo = require("../middleware/validInfo");
const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../middleware/authorize");

//authorizeentication
let count = 0;

router.post("/register", validInfo, async (req, res) => {
  const { email, name, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM customer WHERE email = $1", [
      email,
    ]);

    if (user.rows.length > 0) {
      return res.status(401).json("Customer already exist!");
    }

    const salt = await bcrypt.genSalt(12.194);
    const bcryptPassword = await bcrypt.hash(password, salt);
    count++;
    let newUser = await pool.query(
      "INSERT INTO customer  VALUES ($1,$2, $3) RETURNING *",
      [name, email, bcryptPassword]
    );

    const jwtToken = jwtGenerator(newUser.rows[0].email);

    return res.json({ jwtToken });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error in registering user");
  }
});

router.post("/login", validInfo, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM customer WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Invalid Credential");
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).json("Invalid Credential");
    }
    const jwtToken = jwtGenerator(user.rows[0].email);
    return res.json({ jwtToken });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error in login");
  }
});

router.post("/verify", authorize, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error in verification");
  }
});

module.exports = router;
