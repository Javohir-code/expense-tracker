const express = require("express");
const router = express.Router();
const {
  addUser,
  contacts,
  givingMoneyToEmployee,
  diagramKirim,
  diagramChiqim,
} = require("../controllers/admin.controllers");

router.route("/add-user").post(addUser);
router.route("/contacts").get(contacts);
router.route("/expense").post(givingMoneyToEmployee);
router.route("/diagram/kirim").get(diagramKirim);
router.route("/diagram/chiqim").get(diagramChiqim);

module.exports = router;
