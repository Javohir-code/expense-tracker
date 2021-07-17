const User = require("../models/User");
const Qarz = require("../models/Qarz");
const Chiqim = require("../models/Chiqim");
const Kirim = require("../models/Kirim");
const _ = require("lodash");
const moment = require("moment");
const { filter } = require("lodash");

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

// @desc Xarajatlar Ro'yxati kun boyicha(Qarz)
// @route GET /admin/qarz/lists
// @access Private
exports.listQarz = async (req, res, next) => {
  try {
    const qarzlar = await Qarz.find({});
    const queryDate = req.query.date;
    const newArray = [];
    qarzlar.forEach((date) => {
      const dateObj = date.dateQarz;
      var month = dateObj.getUTCMonth() + 1;
      var day = dateObj.getUTCDate();
      var year = dateObj.getUTCFullYear();
      day = day.toString().split("") < 10 ? "0" + day : day;
      month = month.toString().split("") < 10 ? "0" + month : month;
      var newdate = day + "." + month + "." + year;
      if (newdate == queryDate) {
        newArray.push(date);
      }
    });
    return res.status(200).send(newArray);
  } catch (error) {
    return res
      .status(500)
      .send("Server error while sending list of the qarz data");
  }
};

// @desc Xarajatlar Ro'yxati kun boyicha(Chiqim)
// @route GET /admin/chiqim/lists
// @access Private
exports.listChiqim = async (req, res, next) => {
  try {
    const chiqimlar = await Chiqim.find({});
    const queryDate = req.query.date;
    const newArray = [];
    chiqimlar.forEach((date) => {
      const dateObj = date.dateChiqim;
      var month = dateObj.getUTCMonth() + 1;
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
    return res
      .status(500)
      .send("Server error while sending list of the chiqim data");
  }
};

// @desc Xarajatlar Diagrammasi oy bo'yicha(Chiqim)
// @route GET /admin/diagramm/expense
// @access Private
exports.diagrammChiqim = async (req, res, next) => {
  try {
    const chiqimlar = await Chiqim.find({});
    let filtered = {};
    let total = 0;
    let length = 0;
    const queryData = req.query.month;
    if (queryData) {
      length = chiqimlar.length;
    } else {
      length;
    }
    chiqimlar.forEach((chiqim) => {
      const createdAt = moment(chiqim.createdAt).format("MMMM");
      if (createdAt == queryData) {
        total += chiqim.amountChiqim;
      }
    });
    filtered = { month: queryData, amount: total };
    return res.status(200).json({ count: length, result: filtered });
  } catch (error) {
    return res
      .status(400)
      .send("Error occured while sending a diagramm data of chiqim");
  }
};

// @desc Xarajatlar Diagrammasi oy bo'yicha(Qarz)
// @route GET /admin/diagramm/debt
// @access Private
exports.diagrammQarz = async (req, res, next) => {
  try {
    const debts = await Qarz.find({});
    let filtered = {};
    const queryData = req.query.month;
    let total = 0;
    let length = 0;
    if (queryData) {
      length = debts.length;
    } else {
      length;
    }
    debts.forEach((debt) => {
      const createdAt = moment(debt.dateQarz).format("MMMM");
      if (createdAt == queryData) {
        total += debt.amountQarz;
      }
    });
    filtered = { month: queryData, amount: total };
    return res.status(200).json({ count: length, result: filtered });
  } catch (error) {
    return res
      .status(400)
      .send("Error occured while sending a diagramm data of chiqim");
  }
};
