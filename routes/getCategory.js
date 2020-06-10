const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const category = await pool.query("SELECT * FROM category WHERE id = $1", [
      id,
    ]);

    res.json(category.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error in getting category");
  }
});

module.exports = router;
