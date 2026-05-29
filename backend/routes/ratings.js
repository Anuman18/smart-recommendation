const express = require("express");
const router = express.Router();

const Rating = require("../models/Rating");

router.post("/", async (req, res) => {
  try {
    const rating = await Rating.create(req.body);
    const io = req.app.get("io");

io.emit("new-rating", {
  message: "New rating added",
  rating,
});

    res.status(201).json(rating);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const ratings = await Rating.find()
      .populate("user")
      .populate("item");

    res.json(ratings);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;