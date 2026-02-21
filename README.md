# 🎧 Sangeet – Full Stack Music Player System

A full-stack web-based music player inspired by Spotify, featuring user authentication, personalized libraries (Favorites & Recently Played), multilingual support, and dynamic music streaming.

---

## 🚀 Features

- 🔐 **Secure Authentication**
  - User Signup & Login using JWT
  - Password hashing using bcrypt
- 🎵 **Dynamic Music Streaming**
  - Songs fetched from MongoDB database
  - Folder-based categorization (Romance, Peace, Party, J-pop)
- ❤️ **Favorites System**
  - Toggle like/unlike songs
  - Personalized favorite library per user
- ⏯ **Recently Played**
  - Tracks last 20 played songs
  - Maintains play history order
- 🌍 **Multilingual UI**
  - English 🇬🇧
  - Hindi 🇮🇳
  - Japanese 🇯🇵
- 🎛 **Player Controls**
  - Play / Pause / Next / Previous
  - Seekbar with real-time timing
  - Volume control slider
- 📱 **Responsive UI**
  - Sidebar transitions for mobile view

---

## 🛠 Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose ODM

### Authentication
- JSON Web Tokens (JWT)
- bcryptjs (Password Hashing)

---

## 📂 Project Structure

``` bash
Spotify/
│
├── Frontend/
│ ├── index.html
│ ├── login.html
│ ├── signup.html
│ ├── script.js
│ ├── style.css
│ ├── Images/
│ └── SVGS/
│
├── models/
│ ├── User.js
│ └── song.js
│
├── middleware/
│ └── authmiddleware.js
│
├── public/
│ └── Music/
│ ├── Romance/
│ ├── Peace/
│ ├── Party/
│ └── J pop/
│
├── server.js
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Akhil-00001/Music-Player-System.git
cd Music-Player-System
2️⃣ Install dependencies
npm install
3️⃣ Start MongoDB locally

Make sure MongoDB is running on:

mongodb://127.0.0.1:27017/musicDB
4️⃣ Run the server
nodemon server.js
5️⃣ Open in browser
http://localhost:3000
🔐 API Endpoints
Authentication

POST /api/auth/signup

POST /api/auth/login

User Data

GET /api/user/me

POST /api/user/favorite

POST /api/user/recent

Songs

GET /api/songs/:folder
```
---

## 🧠 Future Improvements

- Playlist creation system

- Search functionality

- Cloud deployment (Render / AWS)

- Dark / Light theme toggle

- Recommendation system using ML

## 👨‍💻 Author

Akhil Kotnala
```python
GitHub: https://github.com/Akhil-00001
```
