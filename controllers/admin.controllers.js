const User = require("../models/User");
const Kirim = require("../models/Kirim");
const Chiqim = require("../models/Chiqim");
const _ = require("lodash");
const moment = require("moment");
const { query } = require("express");
const { rest } = require("lodash");

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
    return res.status(400).send("Error while giving a money", error);
  }
};

// @desc Xarajatlar Diagrammasi(Kirim)
// @route GET /admin/diagram/kirim
// @access Private
exports.diagramKirim = async (req, res, next) => {
  try {
    const kirimlar = await Kirim.find({});
    const queryDate = req.query.date;
    const newArray = [];
    kirimlar.forEach((date) => {
      const dateObj = date.dateKirim;
      var month = dateObj.getUTCMonth() + 1; //months from 1-12
      var day = dateObj.getUTCDate();
      var year = dateObj.getUTCFullYear();
      day = day.toString().split("") < 10 ? "0" + day : day;
      month = month.toString().split("") < 10 ? "0" + month : month;
      newdate = day + "." + month + "." + year;
      if (newdate == queryDate) {
        newArray.push(date);
      }
    });
    return res.status(200).send(newArray);
  } catch (error) {
    return res.status(500).send("Server error while sending diagram data");
  }
};

// @desc Xarajatlar Diagrammasi(Chiqim)
// @route GET /admin/diagram/chiqim
// @access Private
exports.diagramChiqim = async (req, res, next) => {
  try {
    const chiqimlar = await Chiqim.find({});
    const queryDate = req.query.date;
    const newArray = [];
    chiqimlar.forEach((date) => {
      const dateObj = date.dateChiqim;
      var month = dateObj.getUTCMonth() + 1; //months from 1-12
      var day = dateObj.getUTCDate();
      var year = dateObj.getUTCFullYear();
      day = day.toString().split("") < 10 ? "0" + day : day;
      month = month.toString().split("") < 10 ? "0" + month : month;
      newdate = day + "." + month + "." + year;
      if (newdate == queryDate) {
        newArray.push(date);
      }
    });
    return res.status(200).send(newArray);
  } catch (error) {
    return res.status(500).send("Server error while sending diagram data");
  }
};
