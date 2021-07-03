const express = require("express");
const router = express.Router();
const {
  addUser,
  contacts,
  givingMoneyToEmployee,
} = require("../controllers/admin.controllers");

router.route("/add-user").post(addUser);
router.route("/contacts").get(contacts);
router.route("/expense").post(givingMoneyToEmployee);

module.exports = router;
