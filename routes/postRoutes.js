const express = require("express");
const router = express.Router();
const { requireSignin } = require("../controllers/authController");
const { userById } = require("../controllers/userController");

//bringing controllers
//post controller
const {
  getPost,
  createPost,
  postByUser,
  isPoster,
  deletePost,
  postById,
  updatePost,
} = require("../controllers/postController"); // GET

// all posts
router.get("/posts", getPost);

// all posts by a user
router.get("/posts/by/:userId", requireSignin, postByUser);

// create post
router.post("/post/new/:userId", requireSignin, createPost);

// delete post
router.delete("/post/:postId", requireSignin, isPoster, deletePost);

//Update post -> put request
router.put("post/:postId", requireSignin, isPoster, updatePost);

// anytime req has postId parameter, this will execute first
router.param("postId", postById);

// anytime req has userId parameter, this will execute first
router.param("userId", userById);

module.exports = router;
