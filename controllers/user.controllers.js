const User = require("../models/User");
const Chiqim = require("../models/Chiqim");
const Qarz = require("../models/Qarz");
const Kirim = require("../models/Kirim");
const _ = require("lodash");
const moment = require("moment");

// @desc Login User
// @route POST /user/login
// @access Public
exports.loginUser = async (req, res, next) => {
  try {
    const user = await User.findByCredentials(
      req.body.msisdn,
      req.body.password
    );
    const token = user.generateAuthToken();
    console.log(user);
    const userInfo = _.pick(user, ["_id", "isAdmin"]);
    return res
      .header("auth-user", token)
      .json({ token: token, user: userInfo });
  } catch (error) {
    return res.status(400).send("Password or msisdn is not valid");
  }
};

// @desc Get User By ID
// @route GET /user/:id
// @access Private
exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { momentY } = req.query;
    const { momentM } = req.query;
    let result = [];
    const user = await User.findUserById(userId);
    user[0].chiqimlar.forEach((chiqim) => {
      const momentYear = moment(chiqim.dateChiqim).format("YYYY");
      const momentMonth = moment(chiqim.dateChiqim).format("MMMM");
      if (momentYear == momentY && momentMonth == momentM) {
        if (JSON.stringify(user[0]._id) == JSON.stringify(chiqim.user)) {
          chiqim.user = user[0].name;
          result.push(chiqim);
        }
      }
    });
    user[0].chiqimlar = result;

    return res.status(200).send(user);
  } catch (error) {
    return res.status(404).send("No user found with this ID", error);
  }
};

// @desc Spending a money
// @route POST /user/spend-money
// @access Private
exports.spendMoneyByUser = async (req, res, next) => {
  try {
    const chiqim = new Chiqim(req.body);
    const result = await chiqim.save();
    const spendMoney = await Chiqim.populate(result, { path: "user" });
    return res.status(201).send(spendMoney);
  } catch (error) {
    return res.status(500).send("Error occured while spending a money", error);
  }
};

// @desc Getting A Qarz
// @route POST /user/get-qarz
// @access Private
exports.gettingQarzByUser = async (req, res, next) => {
  try {
    const qarz = new Qarz(req.body);
    const result = await qarz.save();
    const gettingQarz = await Qarz.populate(result, { path: "user" });
    return res.status(201).send(gettingQarz);
  } catch (error) {
    return res.status(500).send("Error occured while getting a qarz", error);
  }
};

// @desc Get A Total Expense Specific User
// @route GET /user/:id/total-expense
// @access Private
exports.getttingTotalExpenseAndKirimOfUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { momentY } = req.query;
    const { momentM } = req.query;
    let result = {};
    let totalChiqim = 0;
    let totalKirim = 0;
    const expenses = await Chiqim.find({ user: id });
    const kirimlar = await Kirim.find({ user: id });
    expenses.forEach((exp) => {
      const momentYear = moment(exp.dateChiqim).format("YYYY");
      const momentMonth = moment(exp.dateChiqim).format("MMMM");
      if (momentYear == momentY && momentMonth == momentM) {
        totalChiqim += exp.amountChiqim;
      }
    });
    kirimlar.forEach((kirim) => {
      const momentYear = moment(kirim.dateKirim).format("YYYY");
      const momentMonth = moment(kirim.dateKirim).format("MMMM");
      if (momentYear == momentY && momentMonth == momentM) {
        totalKirim += kirim.amountKirim;
      }
    });
    result = {
      month: momentM,
      totalChiqim: totalChiqim,
      totalKirim: totalKirim,
    };
    return res.status(200).json({ result: result });
  } catch (error) {
    return res.json(
      "Error occured while getting a total expense of user",
      error
    );
  }
};
