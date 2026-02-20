const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Song = require("./models/song");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/Music", express.static("public/Music"));


app.use(express.static("Frontend"));


mongoose.connect("mongodb://127.0.0.1:27017/musicDB")
.then(()=> console.log("MongoDB Connected"));


app.get("/api/songs/:folder", async (req, res) => {
  const songs = await Song.find({ folder: req.params.folder });
  res.json(songs);
});

app.listen(3000, () => console.log("Server running on port 3000"));
