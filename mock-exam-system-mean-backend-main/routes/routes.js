const router = require("express").Router();

const userController = require("../controllers/user-controller");
const testController = require("../controllers/test-controller");
const attemptController = require("../controllers/attempt-controller");

const checkAuth = require("../middleware/check-auth");

router.get("/", (req, res) => {
  res.json("Backend running!");
});

router.post("/api/signup", userController.signup);

router.post("/api/login", userController.login);
router.post("/api/reset-login", userController.resetLogin);
router.post("/api/reset-all-login", userController.resetAllLogin);
router.post("/api/logout", userController.logout);

// Get all tests when user is on home page
router.get("/api/get-tests", testController.getTests);

// Get all tests created by a particular admin when user is on home page
router.get("/api/get-admin-tests/:userId", testController.getAdminTests);

// Unauthorized access is not allowed for below routes
router.use(checkAuth);

// Save test score in the database
router.post("/api/save-score", userController.saveScore);

// Show tests attempted by user
router.get("/api/my-tests/:userId", userController.showTestsTakenByUser);

// Save a test in the database
router.post("/api/save-test", testController.saveTest);

// Delete a test from the database
router.delete("/api/delete-test/:testId", testController.deleteTest);

// Get all the attempts of a user
router.get("/api/user-attempts/:userId", attemptController.getUserAttempts);

// Get all the attempts of a test
router.get("/api/test-results/:testId", attemptController.getTestResults);

// Create an attempt for a test
router.post("/api/create-attempt", attemptController.createAttempt);

router.post(
  "/api/check-attempt-allowed",
  attemptController.checkAttemptAllowed
);

module.exports = router;
