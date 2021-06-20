const express = require("express");
const router = express.Router();
const { loginUser, getUserById } = require("../controllers/user.controllers");

router.route("/login").post(loginUser);
router.route("/:id").get(getUserById);

module.exports = router;
