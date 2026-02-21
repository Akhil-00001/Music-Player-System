// const jwt = require("jsonwebtoken");

// module.exports = function (req, res, next) {
//     const token = req.headers.authorization;

//     if (!token) {
//         return res.status(401).json({ message: "No token" });
//     }

//     try {
//         const decoded = jwt.verify(token, "supersecretkey");
//         req.user = decoded.id; // user id from token
//         next();
//     } catch (err) {
//         res.status(401).json({ message: "Invalid token" });
//     }
// };
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "No token, access denied" });
    }

    try {
        const decoded = jwt.verify(token, "supersecretkey");
        req.user = decoded;   // { id: "..." }
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid token" });
    }
};