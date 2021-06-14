const express = require("express");
const router = express.Router();
const { addUser } = require("../controllers/admin.controllers");

router.route("/add-user").post(addUser);

module.exports = router;
