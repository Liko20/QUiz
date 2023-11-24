const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  test_name: { type: String, required: true, unique: true },
  total_marks: { type: Number, required: true },
  test_duration: { type: Number, required: true },
  test_pin: { type: Number, required: true },
  number_of_questions: { type: Number, required: true },
  allow_multiple_attempts: { type: Boolean, required: false, default: false },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  questions: [
    {
      title: { type: String, required: true },
      a: { type: String, required: true },
      b: { type: String, required: true },
      c: { type: String, required: true },
      d: { type: String, required: true },
      correct: { type: Number, required: true },
      titledatatype: { type: Boolean, required: true },
      adatatype: { type: Boolean, required: true },
      bdatatype: { type: Boolean, required: true },
      cdatatype: { type: Boolean, required: true },
      ddatatype: { type: Boolean, required: true },

    },
  ],
});

module.exports = mongoose.model("Test", testSchema);
