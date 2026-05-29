const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const contentRecommendationRoutes = require("./routes/contentRecommendation");
const connectDB = require("./config/db");
const User = require("./models/User");
const userRoutes = require("./routes/users");
const itemRoutes = require("./routes/items");
const ratingRoutes = require("./routes/ratings");
const recommendationRoutes = require("./routes/recommendation");
const hybridRoutes = require("./routes/hybridRecommendation");
const nlpRoutes = require("./routes/nlpRecommendation");
const authRoutes = require("./routes/auth");
const favoriteRoutes = require(
  "./routes/favorites"
);


dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/recommend", recommendationRoutes);
app.use(
  "/api/content-recommend",
  contentRecommendationRoutes
);
app.use("/api/hybrid-recommend", hybridRoutes);
app.use("/api/nlp-recommend", nlpRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoriteRoutes);

app.get("/", (req, res) => {
  res.send("Recommendation Engine API Running");
});

const PORT = process.env.PORT || 8000;

const http = require("http");

const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.set("io", io);

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});

app.get("/test-user", async (req, res) => {
  try {
    const user = await User.create({
      name: "Anu",
      email: "anu@test.com",
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});