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
const path = require("path");

dotenv.config();
const PORT = process.env.PORT || 5000;

// !Database connection
mongoose.set("strictQuery", false);
connectDB();

// !Middleware
app.use(express.json());
app.use(cors());

// !Routes
app.use("/api/users", userRoute);
app.use("/api/auth", userAuth);
app.use("/api/secure-route", verifiedToken, (req, res) => {
  const user = req.user;
  res.status(200).json({ user: user });
});

// !Deployment
// __dirname = path.resolve();
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "./client/build")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running..");
//   });
// }

// !Vercel
// Serve static files from the "client/build" directory
app.use(express.static(path.join(__dirname, "../client/build")));

// Handle all other routes and serve the index.html file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.listen(PORT, console.log(`Server started on PORT ${PORT}`));
