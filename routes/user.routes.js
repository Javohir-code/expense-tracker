const express = require("express");
const router = express.Router();
const { loginUser } = require("../controllers/user.controllers");

router.route("/login").post(loginUser);

module.exports = router;
