const mongoose = require("mongoose");

const kirimSchema = new mongoose.Schema(
  {
    amountKirim: {
      type: Number,
      required: true,
    },
    descriptionKirim: {
      type: String,
    },
    dateKirim: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    adminId: {
      type: String,
    },
  },
  {
    collection: "kirimlar",
  }
);
const Kirim = mongoose.model("Kirim", kirimSchema);

module.exports = Kirim;
