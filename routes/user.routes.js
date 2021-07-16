const express = require("express");
const router = express.Router();
const {
  loginUser,
  getUserById,
  spendMoneyByUser,
  gettingQarzByUser,
} = require("../controllers/user.controllers");

router.route("/login").post(loginUser);
router.route("/:userId").get(getUserById);
router.route("/spend-money").post(spendMoneyByUser);
router.route("/get-qarz").post(gettingQarzByUser);

module.exports = router;
