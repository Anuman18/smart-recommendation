const express = require("express");
const router = express.Router();

const Rating = require("../models/Rating");
const Item = require("../models/Item");

const calculateSimilarity = require(
  "../utils/tfidfRecommendation"
);

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const likedRatings = await Rating.find({
      user: userId,
      rating: { $gte: 4 },
    }).populate("item");

    if (likedRatings.length === 0) {
      return res.json({
        recommendations: [],
      });
    }

    const likedDescriptions = likedRatings.map(
      (r) =>
        `${r.item.title} ${r.item.description}`
    );

    const allItems = await Item.find();

    const recommendations = [];

    allItems.forEach((item) => {
      const itemText =
        `${item.title} ${item.description}`;

      let totalSimilarity = 0;

      likedDescriptions.forEach((desc) => {
        totalSimilarity += calculateSimilarity(
          desc,
          itemText
        );
      });

      recommendations.push({
        item,
        similarity: totalSimilarity,
      });
    });

    recommendations.sort(
      (a, b) => b.similarity - a.similarity
    );

    res.json(recommendations.slice(0, 5));
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;