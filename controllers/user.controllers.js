const User = require("../models/User");
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
    const user = await User.findById({ _id: req.params.id });
    return res
      .status(200)
      .send(
        _.pick(user, ["_id", "isAdmin", "name", "email", "msisdn", "createdAt"])
      );
  } catch (error) {
    return res.status(404).send("No user found with this ID");
  }
};
