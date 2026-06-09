const express = require("express");
const {
  login,
  changePassword,
  requestForgotPasswordOtp,
  resetPasswordWithOtp,
  listRegistrationGyms,
  registerMember
} = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/login", login);
router.post("/forgot-password/request-otp", requestForgotPasswordOtp);
router.post("/forgot-password/reset", resetPasswordWithOtp);
router.patch("/change-password", requireAuth, changePassword);
router.get("/registration-gyms", listRegistrationGyms);
router.post("/register-member", registerMember);

module.exports = router;
