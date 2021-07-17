const express = require("express");
const router = express.Router();
const { signup, signin, signout } = require("../controllers/authController");
const { userById } = require("../controllers/userController");

// signup
router.post("/signup", signup);

//signin
router.post("/signin", signin);

//signout
router.get("/signout", signout);

// anytime req has userId parameter, this will execute first
router.param("userId", userById);
module.exports = router;
