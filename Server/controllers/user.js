const User = require("../models/user");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.postUserLogin = async (req, res, next) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const user = await User.findOne({ username: username });
    if (!user) return res.status(400).json({ error: "Username not exists" });
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(400).json({ error: "Wrong username or password" });
    }

    res.status(200).json({
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postUserRegister = (req, res, next) => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(req.body.password, salt);
  // Kiểm tra xem username đã tồn tại hay chưa
  User.findOne({
    $or: [{ username: req.body.username }, { email: req.body.email }],
  })
    .then(async (exists) => {
      if (exists) {
        return res.status(409).json({ error: "Username/Email exists" });
      } else {
        const newUser = new User({
          username: req.body.username,
          password: hash,
          fullName: req.body.fullName,
          email: req.body.email,
          phoneNumber: req.body.phoneNumber,
        });
        newUser
          .save()
          .then((savedUser) => {
            const { password, isAdmin, ...otherDetails } = savedUser._doc;
            res.status(200).json({ ...otherDetails, message: "OK" });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

//--------------------------------------------------ADMIN MANAGER-------------------------------------------------------------------------------//

exports.adminGetUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isAdmin: false });
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
};

exports.getAdminLogin = async (req, res, next) => {
  try {
    const userRequest = req.query;
    const user = await User.findOne({
      username: userRequest.username,
    });
    if (!user) return res.status(400).json({ error: "Username not exists" });
    const isValid = await bcrypt.compare(userRequest.password, user.password);
    if (!isValid)
      return res.status(400).json({ error: "Incorrect username or password" });
    const token = await jwt.sign(
      { username: user.username, isAdmin: user.isAdmin },
      process.env.SECRET
    );
    return res.status(200).json({
      email: user.email,
      username: user.username,
      _id: user._id,
      token: token,
    });
  } catch (error) {
    res.status(404).json({ error: "Not found user" });
  }
};

exports.adminRegister = (req, res, next) => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(req.body.data.password, salt);
  // Kiểm tra xem username đã tồn tại hay chưa
  console.log(req.body.data);
  User.findOne({
    $or: [{ username: req.body.data.username }, { email: req.body.data.email }],
  })
    .then(async (exists) => {
      if (exists) {
        return res.status(409).json({ error: "Username exists" });
      } else {
        const newUser = new User({
          username: req.body.data.username,
          password: hash,
          fullName: req.body.data.fullName,
          email: req.body.data.email,
          phoneNumber: req.body.data.phoneNumber,
          isAdmin: true,
        });
        newUser
          .save()
          .then((savedUser) => {
            const { password, isAdmin, createdAt, updatedAt, ...otherDetails } =
              savedUser._doc;
            res.status(200).json(otherDetails);
          })
          .catch((error) => {
            res.status(500).json({ error: "Internal Server Error" });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
};
