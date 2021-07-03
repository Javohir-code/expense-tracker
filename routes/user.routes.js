const express = require("express");
const router = express.Router();
const {
  loginUser,
  getUserById,
  spendMoneyByUser,
} = require("../controllers/user.controllers");

router.route("/login").post(loginUser);
router.route("/:id").get(getUserById);
router.route("/spend-money").post(spendMoneyByUser);

module.exports = router;
