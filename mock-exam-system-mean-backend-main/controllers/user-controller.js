const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user-model");
const userDataValidation = require("../validations/user-data-validation");

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate the signup form data
  try {
    await userDataValidation.signupValidationSchema.validate(req.body);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  // Find whether the email already exists
  const existing_user = await User.findOne({ email: email });
  if (existing_user)
    return res
      .status(403)
      .json({ message: "User already exists. Please login." });

  // Hash the password for security
  let hashed_password = await bcrypt.hash(password, 12);

  // Capitalize first letter of every word in the name
  const capitalized_name = name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Save the user data in database
  const new_user = new User({
    name: capitalized_name,
    email,
    password: hashed_password,
  });
  try {
    await new_user.save();
  } catch (err) {
    return res.status(500).json({ message: "Internal server error." });
  }

  return res.status(200).json({ message: "User created. Please log in now." });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate the login form data
  try {
    await userDataValidation.loginValidationSchema.validate(req.body);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  // Find whether the email is not registered
  const existing_user = await User.findOne({ email: email });
  if (!existing_user)
    return res
      .status(404)
      .json({ message: "User is not registered. Please sign up first." });

  if (existing_user.isLoggedIn === true) {
    if (req.headers.authorization !== undefined) {
      // Check if the token value is correct
      const token = req.headers.authorization.split(" ")[1];
      try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (decodedToken.id !== existing_user._id) {
          return res.status(403).json({ message: "Invalid token." });
        }
      } catch (error) {
        return res.status(403).json({ message: "Invalid token." });
      }
    } else {
      return res
        .status(403)
        .json({ message: "User is already logged in some other device." });
    }
  }

  // Find whether the entered password is correct
  let is_valid = await bcrypt.compare(password, existing_user.password);
  if (!is_valid)
    return res
      .status(400)
      .json({ message: "Incorrect password. Please try again." });

  // Update the isLoggedIn value of existing_user
  existing_user.isLoggedIn = true;
  await existing_user.save();

  // Generate token for user login
  const payload = {
    name: existing_user.name,
    isAdmin: existing_user.isAdmin,
    isSuperAdmin: existing_user.isSuperAdmin,
    id: existing_user._id,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "8h",
  });

  return res.status(200).json({
    token: token,
  });
};

const resetLogin = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.isLoggedIn = false;
    await user.save();

    return res.status(200).json({ message: "Login reset successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const resetAllLogin = async (req, res) => {
  try {
    await User.updateMany(
      { isAdmin: false, isSuperAdmin: false },
      { isLoggedIn: false }
    );
    return res.status(200).json({ message: "All logins reset successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const logout = async (req, res) => {
  const { user_id } = req.body;

  // Find current user
  const existing_user = await User.findById(user_id);
  if (!existing_user)
    return res.status(404).json({ message: "Please try again" });

  existing_user.isLoggedIn = false;
  await existing_user.save();

  return res
    .status(200)
    .json({ message: "Successfully logged out from the system." });
};

// Save test score
const saveScore = async (req, res) => {
  const { user_id, attempted_test_id, attempted_test_info } = req.body;

  // Find current user
  const existing_user = await User.findById(user_id);
  if (!existing_user)
    return res.status(404).json({ message: "Please try again" });

  // Add test attempted by the user
  const info = {
    attempted_test_id: attempted_test_id,
    attempted_test_info: JSON.stringify(attempted_test_info),
  };
  existing_user.attempted_tests = [info, ...existing_user.attempted_tests];

  try {
    await existing_user.save();
  } catch (err) {
    return res.status(500).json({ message: "Internal server error." });
  }

  return res.status(200).json({ message: "success" });
};

const showTestsTakenByUser = async (req, res) => {
  let userId = req.params.userId;
  let userData;
  try {
    userData = await User.findById(userId);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
  if (!userData) return res.status(404).json({ message: "Please try again" });
  return res.status(200).json({ tests: userData.attempted_tests });
};

module.exports = {
  signup,
  login,
  logout,
  saveScore,
  showTestsTakenByUser,
  resetLogin,
  resetAllLogin,
};
