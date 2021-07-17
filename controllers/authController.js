const jwt = require("jsonwebtoken");
require("dotenv").config();
const expressJwt = require("express-jwt");

const User = require("../models/userModel");

const AppError = require("../utilities/appError");

// exports.signup = (req, res, next) => {
//   User.find({ email: req.body.email }, (err, user) => {
//     console.log(user);
//     if (err || user == true) {
//       return next(new AppError(400, "User already exists"));
//     }
//     user.save((err, user) => {
//       if (err) {
//         return next(new AppError(400, " can not save user"));
//       }
//       res.json({ message: "Account created successfully" });
//     });
//   });
// };

exports.signup = async (req, res, next) => {
  const userExists = await User.find({ email: req.body.email });
  console.log(userExists);
  if (userExists == true) {
    return next(new AppError(403, "User already exists"));
  }
  const user = await new User(req.body);
  await user.save();
  res.status(200).json({ user });
};

exports.signin = (req, res, next) => {
  const { email, password } = req.body; // desturcturing email, password from req.body
  User.findOne({ email }, (err, user) => {
    // if user doesn't exist || error'
    if (err || !user) {
      return next(new AppError(403, "no user"));
    }
    // if credential doesn't match
    if (!user.authenticate(password)) {
      return next(new AppError(401, "Email and Password doesn't match"));
    }
    // persist token
    const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET);
    res.cookie("t", token, { expire: new Date() + 10000 });
    const { _id, email, name } = user;
    res.status(200).json({ token, user: { _id, email, name } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  return res.status(201).json({ message: "Signout successful " });
};

// exports.requireSignin = expressJwt({
//   secret: process.env.JWT_SECRET,
// });
exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["sha1", "RS256", "HS256"],
  userProperty: "auth",
});
