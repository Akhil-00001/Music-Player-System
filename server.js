const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Song = require("./models/song");
const User = require("./models/User.js");

const app = express();
exports.app = app;

app.use(cors());
app.use(express.json());


app.use("/Music", express.static("public/Music"));
app.use(express.static("Frontend"));


mongoose.connect("mongodb://127.0.0.1:27017/musicDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const authMiddleware = require("./middleware/authmiddleware.js");
const song = require("./models/song");

app.get("/api/user/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
});


app.post("/api/user/recent", authMiddleware, async (req, res) => {
  try {
    const { songId, title, file_url } = req.body;

    await User.findByIdAndUpdate(
      req.user.id,
      {
        $pull: { recentlyPlayed: { songId } }  // remove if already exists
      }
    );

    await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: {
          recentlyPlayed: {
            $each: [{ songId, title, file_url, playedAt: new Date() }],
            $position: 0,
            $slice: 20
          }
        }
      }
    );

    res.json({ message: "Updated recently played" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/user/favorite", authMiddleware,async (req, res) => {
  try {
    const { songId, title, artist, file_url } = req.body;

    const user = await User.findById(req.user.id);

    const exists = user.favorites.find(s => s.songId === songId);

    if (exists) {
      await User.findByIdAndUpdate(req.user.id, { 
        $pull: { favorites: { songId } }
      });
      return res.json({ liked: false });
    } else {
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          favorites: { songId, title, artist, file_url }
        }
      });
      return res.json({ liked: true });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server errors" });
  }
});



app.post("api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: "Account created successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/songs/:fld", async (req, res) => {
  try {
    const arr = await Song.find({ folder: req.params.fld });
    res.json(arr);
  }catch(err){
    res.status(500).json({ message: "Error fetching songs" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id },
      "supersecretkey",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});



app.listen(3000, () => console.log("Server running on port 3000"));
