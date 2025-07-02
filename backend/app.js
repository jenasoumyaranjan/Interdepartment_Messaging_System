const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/message");

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// DB Sync using proper db
const db = require('./models'); // or './config/db' depending on your structure
console.log("✅ Loaded Models:", Object.keys(db));

db.sequelize.sync()
  .then(() => console.log("✅ Database synced"))
  .catch((err) => console.error("❌ Sync error:", err));

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

