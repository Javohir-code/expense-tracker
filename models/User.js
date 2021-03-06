const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    msisdn: {
      type: String,
      required: true,
      unique: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "users",
  }
);

userSchema.statics.findByCredentials = async (msisdn, password) => {
  const user = await User.findOne({ msisdn });
  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
  }
  next();
});

userSchema.methods.generateAuthToken = () => {
  const token = jwt.sign({ _id: this._id }, process.env.TOKEN_SECRET);
  return token;
};

userSchema.statics.findUserById = async function (userId) {
  const user = await this.findById({ _id: userId });
  const userid = user._id;
  return this.aggregate([
    { $match: { _id: userid } },

    {
      $lookup: {
        from: "chiqimlar",
        localField: "_id",
        foreignField: "user",
        as: "chiqimlar",
      },
    },
    // { $unwind: "$chiqimlar" },
    // {
    //   $group: {
    //     _id: { $last: "$_id" },
    //     isAdmin: { $last: "$isAdmin" },
    //     name: { $last: "$name" },
    //     email: { $last: "$email" },
    //     msisdn: { $last: "$msisdn" },
    //     password: { $last: "$password" },
    //     createdAt: { $last: "$createdAt" },
    //     chiqimlar: { $addToSet: "$chiqimlar" },
    //   },
    // },
  ]);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
