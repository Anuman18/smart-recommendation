const express = require("express");
const router = express.Router();
const cosineSimilarity = require("../utils/cosineSimilarity");

const Rating = require("../models/Rating");
const Item = require("../models/Item");

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

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
      return res.status(404).json({
        message: "User ratings not found",
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
console.log(targetVector);
console.log(otherVector);
console.log(similarity);


    const targetVector = [];
    const otherVector = [];

    allItems.forEach((itemId) => {
    targetVector.push(targetUserRatings[itemId] || 0);

    otherVector.push(userRatings[otherUserId][itemId] || 0);
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

        if (!similarUser) {
        return res.json({
            recommendations: [],
        });
        }

    const recommendedItems = [];

    for (const itemId in userRatings[similarUser]) {
      if (!targetUserRatings[itemId]) {
        recommendedItems.push(itemId);
      }
    }

    const items = await Item.find({
      _id: { $in: recommendedItems },
    });

    res.json({
      similarUser,
      similarityScore: maxSimilarity,
      recommendations: items,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;