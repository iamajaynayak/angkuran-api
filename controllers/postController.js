const fs = require("fs");
const Post = require("../models/postModel");
const AppError = require("../utilities/appError");
const _ = require("lodash");
const formidable = require("formidable");

//post by id

exports.postById = (req, res, next, id) => {
  Post.findById(id)
    .populate("postedBy", "_id name")
    .exec((err, post) => {
      if (err || !post) {
        return next(new AppError(404, err.message));
      }
      req.post = post;
      next();
    });
};

// Get post
exports.getPost = (req, res) => {
  const posts = Post.find()
    .populate("postedBy", "_id name")
    .select("_id title body")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => console.log(err));
};

// Create post

exports.createPost = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      // console.log(err);
      return next(new AppError(500, "Something went wrong"));
    }

    let post = new Post(fields);

    //removing hashed and salt
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;

    post.postedBy = req.profile;

    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }
    post.save((err, post) => {
      if (err) {
        return next(new AppError(500, "something went wrong"));
      }
      res.json(post);
    });
  });
};

//posts by user

exports.postByUser = (req, res, next) => {
  Post.find({ postedBy: req.profile._id })
    .populate("postedBy", "_id name")
    .sort("created")
    .exec((err, posts) => {
      if (err) {
        return next(new AppError(400, "something went wrong"));
      }

      res.json(posts);
    });
};

exports.isPoster = (req, res, next) => {
  // console.log(req.post);
  // console.log(req.auth);
  // console.log(req.post.postedBy._id);
  // console.log(req.auth._id);
  let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id;
  if (!isPoster) {
    return next(new AppError(400, "You're not authorized"));
  }
  next();
};

// Delete post
exports.deletePost = (req, res) => {
  let post = req.post;
  post.remove((err, post) => {
    if (err) {
      return res.status(400).json("Something went wrong");
    }
    res.json({ message: "Post deleted" });
  });
};

// Update post

exports.updatePost = (req, res, next) => {
  let post = req.post;
  post = _.extend(post, req.body);
  post.updated = Date.now();
  post.save((err) => {
    if (err) {
      return next(new AppError(400, "Can not update post"));
    }
    res.json(post);
  });
};
