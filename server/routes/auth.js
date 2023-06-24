require("dotenv").config();
const router = require("express").Router();
const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const verifiedToken = require("../config/authMiddleware");

router.get("/", (req, res) => {
  res.send(
    `This is the authorization route. <a href='/auth/google'>login with google</a>`
  );
});

// ?GOOGLE Login/Register ----->
// Configure Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Handle the user profile data returned by Google
        // You can save the profile data to your database or perform other actions

        // Check if the user already exists in your database
        let user = await User.findOne({ email: profile.email });

        if (!user) {
          // User doesn't exist, create a new user in your database
          user = new User({
            username: profile.displayName,
            email: profile.email,
            profilePicture: profile.picture,
          });
          await user.save();
        }

        // Call the `done` function to indicate successful authentication and pass the user object
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// Google OAuth callback route
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      // Get the authenticated user object from req.user
      const user = req.user;

      // Generate JWT token for the authenticated user
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        secret,
        { expiresIn: "1h" }
      );

      // Redirect or send token as response
      res.redirect(`/protected-route?token=${token}`);
    } catch (err) {
      res.status(500).json(`Could not authenticate user: ${err}`);
    }
  }
);

// Login with Google
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
// ?GOOGLE Login/Register ----->

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
