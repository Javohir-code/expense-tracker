const express = require("express");
const router = express.Router();
const {
  addUser,
  contacts,
  givingMoneyToEmployee,
  listChiqim,
  listQarz,
  diagrammChiqim,
  diagrammQarz,
  getTotalExpenseOfUser,
  getAllExpenses,
} = require("../controllers/admin.controllers");

router.route("/add-user").post(addUser);
router.route("/contacts").get(contacts);
router.route("/expense").post(givingMoneyToEmployee);
router.route("/qarz/lists").get(listQarz);
router.route("/chiqim/lists").get(listChiqim);
router.route("/diagramm/expense").get(diagrammChiqim);
router.route("/diagramm/debt").get(diagrammQarz);
router.route("/user/:id").get(getTotalExpenseOfUser);
router.route("/expenses").get(getAllExpenses);

module.exports = router;
