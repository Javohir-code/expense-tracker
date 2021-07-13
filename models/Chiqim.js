const mongoose = require("mongoose");

const chiqimSchema = new mongoose.Schema(
  {
    amountChiqim: {
      type: Number,
      required: true,
    },
    descriptionChiqim: {
      type: String,
      required: true,
    },
    dateChiqim: {
      type: Date,
      default: Date.now,
    },
    users: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    collection: "chiqimlar",
  }
);

const Chiqim = mongoose.model("Chiqim", chiqimSchema);

module.exports = Chiqim;
