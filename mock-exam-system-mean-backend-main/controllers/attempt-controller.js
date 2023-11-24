const Attempt = require("../models/attempt-model");
const User = require("../models/user-model");
const Test = require("../models/test-model");

// Fetch all the attempts of a user
const getUserAttempts = async (req, res) => {
  const { userId } = req.params;
  let user, attempts;

  try {
    user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    attempts = await Attempt.find({ user_id: userId });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }

  return res.status(200).json({ attempts: attempts });
};

// Fetch all the attempts of a specific test where every email gets a row with max score
const getTestResults = async (req, res) => {
  const { testId } = req.params;
  let test,
    attempts,
    maxScores = {};

  try {
    test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found." });
    }

    // Get all attempts for the test, and populate the `user_id` field with the actual user object
    attempts = await Attempt.find({ test_id: testId }).populate("user_id");

    // Calculate the maximum score for each user
    attempts.forEach((attempt) => {
      if (!maxScores[attempt.user_id._id]) {
        maxScores[attempt.user_id._id] = attempt.marks_obtained;
      } else if (attempt.marks_obtained > maxScores[attempt.user_id._id]) {
        maxScores[attempt.user_id._id] = attempt.marks_obtained;
      }
    });

    // Create a new array of attempts with only the maximum score for each user
    const maxScoreAttempts = Object.keys(maxScores).map((user_id) => {
      const attempt = attempts.find(
        (attempt) =>
          attempt.user_id._id.toString() === user_id &&
          attempt.marks_obtained === maxScores[user_id]
      );
      return {
        email: attempt.user_id.email,
        marks_obtained: maxScores[user_id],
      };
    });
    return res.status(200).json({
      test: test.test_name,
      results: maxScoreAttempts,
      message: "Result report generated successfully.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

// Check if a user is allowed to attempt a test
const checkAttemptAllowed = async (req, res) => {
  const { user_id, test_id } = req.body;
  let user, test, attempts;

  try {
    user = await User.findById(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    test = await Test.findById(test_id);
    if (!test) {
      return res
        .status(404)
        .json({ success: false, message: "Test not found." });
    }

    // Check if the user has attempted the test before
    attempts = await Attempt.find({ user_id: user_id, test_id: test_id });
    if (test.allow_multiple_attempts === true) {
      return res.status(200).json({
        success: true,
        message: "You are allowed to attempt the test again.",
      });
    } else {
      if (attempts.length >= 1) {
        return res.status(400).json({
          success: false,
          message: "You are already attempted this test once.",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }

  return res
    .status(200)
    .json({ success: true, message: "You are allowed to attempt this test." });
};
// Create a new attempt
const createAttempt = async (req, res) => {
  const { user_id, test_id, marks_obtained } = req.body;
  let user, test, attempt;

  try {
    user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    test = await Test.findById(test_id);
    if (!test) {
      return res.status(404).json({ message: "Test not found." });
    }

    if (
      test.allow_multiple_attempts === false &&
      (await Attempt.find({ user_id: user_id, test_id: test_id }).exec())
        .length > 0
    ) {
      return res.status(400).json({
        message:
          "You have already attempted this test. Multiple attempt for this test is not allowed.",
      });
    }

    attempt = new Attempt({
      user_id: user_id,
      test_id: test_id,
      marks_obtained: marks_obtained,
      attempted_on: Date.now(),
    });

    await attempt.save();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }

  return res.status(201).json({ message: "Attempt created successfully." });
};

module.exports = {
  checkAttemptAllowed,
  getUserAttempts,
  getTestResults,
  createAttempt,
};
