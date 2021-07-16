const User = require("../models/User");
const Chiqim = require("../models/Chiqim");
const Qarz = require("../models/Qarz");
const _ = require("lodash");

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
    return res.header("auth-user", token).send(token);
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
    console.log(typeof userId);
    console.log(userId);
    const user = await User.findUserById(userId);
    return res.status(200).send(user);
  } catch (error) {
    return res.status(404).send("No user found with this ID");
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
