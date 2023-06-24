const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/users");

router.get("/", (req, res) => {
  res.send("This is users route");
});

// Update User
router.post("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
  } else {
    return res.status(403).json("You can only update your account!");
  }
});

// Delete User
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted.");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can only delete your account!");
  }
});

// Check if user exists
router.get("/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
