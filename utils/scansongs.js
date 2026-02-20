const mongoose = require("mongoose");
const fs = require("fs");
const Song = require("../models/song");

mongoose.connect("mongodb://127.0.0.1:27017/musicDB");

const songs = JSON.parse(fs.readFileSync("./data/song.json", "utf-8"));

async function run() {
  await Song.deleteMany(); // clears old data
  await Song.insertMany(songs);
  console.log("✅ Songs Imported to MongoDB");
  process.exit();
}

run();
