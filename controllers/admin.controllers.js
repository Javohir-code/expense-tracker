const User = require("../models/User");
const Qarz = require("../models/Qarz");
const Chiqim = require("../models/Chiqim");
const Kirim = require("../models/Kirim");
const _ = require("lodash");
const moment = require("moment");

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
    const qarzlar = await Qarz.find({}).populate({ path: "user" });
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
    const chiqimlar = await Chiqim.find({}).populate({ path: "user" });
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
exports.diagrammXarajatlar = async (req, res, next) => {
  try {
    const chiqimlar = await Chiqim.find({});
    let result = [];
    const months = ["August", "September", "October", "November", "December"];
    months.forEach((month) => {
      let filtered = {};
      let total = 0;
      let length = 0;
      chiqimlar.forEach((chiqim) => {
        const createdAt = moment(chiqim.dateChiqim.toLocaleString()).format(
          "MMMM"
        );

        if (createdAt == month) {
          total += chiqim.amountChiqim;
          length++;
        }
      });
      filtered = { month: month, amount: total, count: length };

      result.push(filtered);
    });

    // const createdAt = moment(chiqim.createdAt).format("DD-MM-YYYY");
    // const weekNumber = moment(createdAt).week();
    // var nthOfMoth = Math.ceil(createdAt.date() / 7);
    // console.log(createdAt);

    return res.status(200).json({ result: result });
  } catch (error) {
    return res
      .status(400)
      .send("Error occured while sending a diagramm data of chiqim");
  }
};

// @desc Admin -> User Diagrammasi oy bo'yicha(Qarz)
// @route GET /admin/diagramm/kirim
// @access Private
exports.diagrammAdminUser = async (req, res, next) => {
  try {
    const kirims = await Kirim.find({});
    let result = [];
    const months = ["August", "September", "October", "November", "December"];
    months.forEach((month) => {
      let filtered = {};
      let total = 0;
      let length = 0;
      kirims.forEach((kirim) => {
        const createdAt = moment(kirim.dateKirim.toLocaleString()).format(
          "MMMM"
        );
        console.log(createdAt);
        console.log(kirim.dateKirim.toLocaleString());
        if (createdAt == month) {
          total += kirim.amountKirim;
          length++;
        }
      });

      filtered = { month: month, amount: total, count: length };

      result.push(filtered);
    });

    return res.status(200).json({ result: result });
  } catch (error) {
    return res
      .status(400)
      .send("Error occured while sending a diagramm data of chiqim");
  }
};

// @desc Get A User Total expenses
// @route GET /admin/user/:id
// @access Private
exports.getTotalExpenseOfUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    let income = 0;
    let expense = 0;
    let result = {};
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, result: `No user found with this ${id} Id` });
    }

    const kirimlar = await Kirim.find({ user: user._id });
    kirimlar.forEach((kirim) => {
      income += kirim.amountKirim;
    });
    const chiqimlar = await Chiqim.find({ user: user._id });
    chiqimlar.forEach((chiqim) => {
      expense += chiqim.amountChiqim;
    });
    result = { income: income, expense: expense };
    return res.status(200).json({ success: true, result: result });
  } catch (error) {
    return res.status(400).json({ success: false, error: error });
  }
};

// @desc Get A Total Kirim
// @route GET /admin/expenses
// @access Private
exports.getAllExpenses = async (req, res, next) => {
  try {
    const kirimlar = await Kirim.find({}).populate({ path: "user" });
    const queryDate = req.query.date;
    const newArray = [];

    kirimlar.forEach((date) => {
      const dateObj = date.dateKirim;
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
    return res.status(400).send("Error occured", error);
  }
};
