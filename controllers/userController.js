const User = require("../models/userModel");
const AppError = require("../utilities/appError");
const _ = require("lodash");

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return next(new AppError(400, "No user found"));
    }
    req.profile = user;
    next();
  });
};

exports.hasAuthorization = (req, res, next) => {
  const authorized =
    req.profile._id && req.auth._id && req.profile._id === req.auth._id;
  if (!authorized) {
    return next(new AppError(403, "User is not Authorized"));
  }
  next();
};

exports.allUsers = (req, res, next) => {
  User.find((err, users) => {
    if (err) {
      return next(new AppError(404, "Something went wrong"));
    }
    res.status(200).json({ users });
  }).select("name email created updated varified");
};

exports.getUser = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

exports.updateUser = (req, res, next) => {
  let user = req.profile;
  user = _.extend(user, req.body);
  user.save((err) => {
    if (err) {
      return next(new AppError(401, "You are not authorized"));
    }
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    res.json({ user });
  });
};

exports.deleteUser = (req, res, next) => {
  let user = req.profile;
  user.remove((err, user) => {
    if (err) {
      return next(new AppError(400, " Something went wrong"));
    }

    res.json({ message: "Successfully deleted" });
  });
};
