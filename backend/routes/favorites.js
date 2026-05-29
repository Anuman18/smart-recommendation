const express = require("express");

const Favorite = require("../models/Favorite");

const protect = require(
  "../middleware/authMiddleware"
);

const router = express.Router();


// ADD FAVORITE
router.post("/", protect, async (req, res) => {
  try {
    const favorite = await Favorite.create({
      user: req.user.id,
      item: req.body.itemId,
    });

    res.status(201).json(favorite);

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});


// GET USER FAVORITES
router.get("/", protect, async (req, res) => {
  try {
    const favorites = await Favorite.find({
      user: req.user.id,
    }).populate("item");

    res.json(favorites);

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});


// REMOVE FAVORITE
router.delete("/:id", protect, async (req, res) => {
  try {
    await Favorite.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Favorite removed",
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;