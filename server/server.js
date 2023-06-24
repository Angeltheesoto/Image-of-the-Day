// Dependencies
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const userRoute = require("./routes/users");
const userAuth = require("./routes/auth");
const verifiedToken = require("./config/authMiddleware");
const passport = require("passport");

dotenv.config();
const PORT = process.env.PORT || 5000;

// Database connection
mongoose.set("strictQuery", false);
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.json("Hello World!");
});
app.use("/api/users", userRoute);
app.use("/api/auth", userAuth);
app.use("/api/secure-route", verifiedToken, (req, res) => {
  const user = req.user;
  res.status(200).json({ user: user });
});
// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["email", "profile"] })
// );
// app.get('/')

app.listen(PORT, console.log(`Server started on PORT ${PORT}`));
