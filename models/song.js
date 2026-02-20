const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  file_url: String,
  folder: String,
  genre: String,
  image:String
});

module.exports = mongoose.model("Song", songSchema);
