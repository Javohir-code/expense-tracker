const express = require("express");
const router = express.Router();
const { addUser, contacts } = require("../controllers/admin.controllers");

router.route("/add-user").post(addUser);
router.route("/contacts").get(contacts);

module.exports = router;
