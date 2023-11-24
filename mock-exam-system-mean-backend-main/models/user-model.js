const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: false, default: false },
  isSuperAdmin: { type: Boolean, required: false, default: false },
  isLoggedIn: { type: Boolean, required: false, default: false },
  attempted_tests: [
    {
      attempted_test_id: { type: String, required: false },
      attempted_test_info: { type: String, required: false },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
