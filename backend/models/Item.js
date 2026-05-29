const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    tags: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Item", itemSchema);