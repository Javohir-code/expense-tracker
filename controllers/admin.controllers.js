const User = require("../models/User");
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
