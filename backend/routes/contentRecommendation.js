const express = require("express");
const router = express.Router();

const Rating = require("../models/Rating");
const Item = require("../models/Item");

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const userRatings = await Rating.find({
      user: userId,
      rating: { $gte: 4 },
    }).populate("item");

    if (userRatings.length === 0) {
      return res.json({
        recommendations: [],
      });
    }

    const likedTags = new Set();

    userRatings.forEach((rating) => {
      rating.item.tags.forEach((tag) => {
        likedTags.add(tag);
      });
    });

    const allItems = await Item.find();

    const recommendations = [];

    allItems.forEach((item) => {
      let score = 0;

      item.tags.forEach((tag) => {
        if (likedTags.has(tag)) {
          score++;
        }
      });

      if (score > 0) {
        recommendations.push({
          item,
          score,
        });
      }
    });

    recommendations.sort((a, b) => b.score - a.score);

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;