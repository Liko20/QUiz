const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  test_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test",
    required: true,
  },
  marks_obtained: { type: Number, required: true },
  attempted_on: { type: Date, required: true, default: Date.now() },
});

module.exports = mongoose.model("Attempt", attemptSchema);
