const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyToken(token, secretKey) {
  try {
    const decoded = jwt.verify(token, secretKey);

    return decoded; // Trả về thông tin giải mã từ token
  } catch (error) {
    // Xử lý lỗi khi token không hợp lệ
    console.log(error);
    return null;
  }
}

exports.checkAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.query.username });
    if (user.isAdmin) {
      return next();
    } else {
      return res.status(404).json({ error: "No user found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.middleware = async (req, res, next) => {
  const token = req.query.token;
  const decodedToken = await verifyToken(token, process.env.SECRET);
  if (decodedToken.isAdmin) {
    req.user = decodedToken;
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};
