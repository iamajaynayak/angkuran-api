const express = require("express");
const router = express.Router();

const {
  userById,
  allUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const { requireSignin } = require("../controllers/authController");
// const { postById } = require("../controllers/postController");

// Showing all users
router.get("/users", allUsers);

//Showing perticular user
router.get("/user/:userId", requireSignin, getUser);

//update user
router.put("/user/:userId", requireSignin, updateUser);

// Delete user
router.delete("/user/:userId", requireSignin, deleteUser);

// anytime req has userId parameter, this will execute first
router.param("userId", userById);

module.exports = router;
