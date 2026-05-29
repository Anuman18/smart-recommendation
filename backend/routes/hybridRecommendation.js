const express = require("express");
const router = express.Router();

const Rating = require("../models/Rating");
const Item = require("../models/Item");
const protect = require("../middleware/authMiddleware");
const cosineSimilarity = require("../utils/cosineSimilarity");

router.get("/me", protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const ratings = await Rating.find()
      .populate("user")
      .populate("item");

    const userRatings = {};

    ratings.forEach((r) => {
      const uid = r.user._id.toString();

      if (!userRatings[uid]) {
        userRatings[uid] = {};
      }

      userRatings[uid][r.item._id.toString()] = r.rating;
    });

    const targetUserRatings = userRatings[userId];

    if (!targetUserRatings) {
      return res.json({
        recommendations: [],
      });
    }

    let similarUser = null;
    let maxSimilarity = -1;

    for (const otherUserId in userRatings) {
      if (otherUserId === userId) continue;

      const allItems = new Set([
        ...Object.keys(targetUserRatings),
        ...Object.keys(userRatings[otherUserId]),
      ]);

      const targetVector = [];
      const otherVector = [];

      allItems.forEach((itemId) => {
        targetVector.push(targetUserRatings[itemId] || 0);

        otherVector.push(
          userRatings[otherUserId][itemId] || 0
        );
      });

      const similarity = cosineSimilarity(
        targetVector,
        otherVector
      );

      if (similarity > maxSimilarity) {
        maxSimilarity = similarity;
        similarUser = otherUserId;
      }
    }

    const collaborativeItems = [];

    if (similarUser) {
      for (const itemId in userRatings[similarUser]) {
        if (!targetUserRatings[itemId]) {
          collaborativeItems.push(itemId);
        }
      }
    }

    const likedRatings = await Rating.find({
      user: userId,
      rating: { $gte: 4 },
    }).populate("item");

    const likedTags = new Set();

    likedRatings.forEach((rating) => {
      rating.item.tags.forEach((tag) => {
        likedTags.add(tag);
      });
    });

    const allDatabaseItems = await Item.find();

    const contentItems = [];

    allDatabaseItems.forEach((item) => {
      let score = 0;

      item.tags.forEach((tag) => {
        if (likedTags.has(tag)) {
          score++;
        }
      });

      if (score > 0) {
        contentItems.push({
          itemId: item._id.toString(),
          score,
        });
      }
    });

    const hybridMap = {};

    collaborativeItems.forEach((itemId) => {
      hybridMap[itemId] = 5;
    });

    contentItems.forEach((item) => {
      if (!hybridMap[item.itemId]) {
        hybridMap[item.itemId] = 0;
      }

      hybridMap[item.itemId] += item.score;
    });

    const sortedRecommendations = Object.entries(hybridMap)
      .sort((a, b) => b[1] - a[1]);

    const finalItemIds = sortedRecommendations.map(
      (item) => item[0]
    );

    const finalItems = await Item.find({
      _id: { $in: finalItemIds },
    });

    res.json({
      similarUser,
      similarityScore: maxSimilarity,
      recommendations: finalItems,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;