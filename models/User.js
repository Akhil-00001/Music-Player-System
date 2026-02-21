const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,

    // 🔥 Personal data for each user
    favorites: [
        {
            songId: String,
            title: String,
            artist: String,
            file_url: String,
        }
    ],

    recentlyPlayed: [
        {
            songId: String,
            title: String,
            file_url: String,
            playedAt: Date,
        }
    ]
});

module.exports = mongoose.model("User", userSchema);