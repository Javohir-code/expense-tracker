const User = require("../models/User");
const Kirim = require("../models/Kirim");
const _ = require("lodash");

// @desc Adding User
// @route POST /admin/add-user
// @access Private
exports.addUser = async (req, res, next) => {
  try {
    const user = new User(req.body);
    await user.save();
    return res.status(201).send(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "This phone already exists" });
    }
    return res.status(400).send("Unable to add a user", error);
  }
};

// @desc Contacts
// @route GET /admin/contacts
// @access Private
exports.contacts = async (req, res, next) => {
  try {
    const contacts = await User.find({}).sort({ name: 1 });
    return res.status(200).send(contacts);
  } catch (error) {
    return res.status(500).send("Server Error");
  }
};

// @desc Giving a money
// @route POST /admin/expense
// @access Private
exports.givingMoneyToEmployee = async (req, res, next) => {
  try {
    const expense = new Kirim(req.body);
    const result = await expense.save();
    const kirim = await Kirim.populate(result, { path: "user" });
    return res.status(201).send(kirim);
  } catch (error) {
    return res.status(500).send("Server Error while giving a money", error);
  }
};

