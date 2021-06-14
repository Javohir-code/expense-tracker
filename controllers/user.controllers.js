const User = require("../models/User");

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
