require("dotenv").config();
const router = require("express").Router();
const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

router.get("/", (req, res) => {
  res.send(`This is the authorization route.`);
});

// Register User
router.post("/register", async (req, res) => {
  try {
    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // Create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // Save new User
    const user = await newUser.save();
    const token = await jwt.sign(
      { userId: user._id, username: user.username },
      secret,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token: token });
  } catch (err) {
    console.log(err);
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    // Search for user
    const user = await User.findOne({ username: req.body.username });
    if (!user) res.status(404).json("User does not exist!");
    // Checks password is correct by decrypt
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) res.status(400).json("Wrong password!");
    const token = await jwt.sign(
      { userId: user._id, username: user.username },
      secret,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token: token });
  } catch (err) {
    res.status(500).json(`Could not get user login: ${err}`);
  }
});

module.exports = router;
