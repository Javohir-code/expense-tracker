const mongoose = require("mongoose");

const qarzSchema = new mongoose.Schema(
  {
    amountQarz: {
      type: Number,
      required: true,
    },
    descriptionQarz: {
      type: String,
      required: true,
    },
    dateQarz: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    collection: "qarzlar",
  }
);

const Qarz = mongoose.model("Qarz", qarzSchema);

module.exports = Qarz;
