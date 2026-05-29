const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectDB = require("../config/db");

const User = require("../models/User");
const Item = require("../models/Item");
const Rating = require("../models/Rating");

dotenv.config();

connectDB();

const seedData = async () => {
  try {
    await User.deleteMany();
    await Item.deleteMany();
    await Rating.deleteMany();

    console.log("Old data deleted");

    const users = await User.insertMany([
      {
        name: "Anu",
        email: "anu@gmail.com",
      },
      {
        name: "Rahul",
        email: "rahul@gmail.com",
      },
      {
        name: "Priya",
        email: "priya@gmail.com",
      },
    ]);

    const items = await Item.insertMany([
      {
        title: "Machine Learning Basics",
        category: "Course",
        description:
          "Learn machine learning using python and AI",
        tags: ["ml", "python", "ai"],
      },

      {
        title: "Deep Learning Masterclass",
        category: "Course",
        description:
          "Neural networks and deep learning with python",
        tags: ["deep learning", "python", "ai"],
      },

      {
        title: "React Frontend Bootcamp",
        category: "Course",
        description:
          "Modern frontend development using React",
        tags: ["react", "frontend", "javascript"],
      },

      {
        title: "System Design Handbook",
        category: "Book",
        description:
          "Backend architecture and scalable systems",
        tags: ["backend", "system", "design"],
      },

      {
        title: "Data Structures in Java",
        category: "Course",
        description:
          "DSA concepts and algorithms using Java",
        tags: ["dsa", "java", "algorithms"],
      },
    ]);

    await Rating.insertMany([
      {
        user: users[0]._id,
        item: items[0]._id,
        rating: 5,
      },

      {
        user: users[0]._id,
        item: items[2]._id,
        rating: 2,
      },

      {
        user: users[0]._id,
        item: items[4]._id,
        rating: 4,
      },

      {
        user: users[1]._id,
        item: items[0]._id,
        rating: 5,
      },

      {
        user: users[1]._id,
        item: items[1]._id,
        rating: 5,
      },

      {
        user: users[1]._id,
        item: items[2]._id,
        rating: 1,
      },

      {
        user: users[2]._id,
        item: items[3]._id,
        rating: 5,
      },
    ]);

    console.log("Database seeded");

    process.exit();
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

seedData();