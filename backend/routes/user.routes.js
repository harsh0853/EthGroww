import { Router } from "express";
import {
  loginUser,
  logOutUser,
  registerUser,
  refreshAccessToken,
  getCurrentUser,
  updateAccountDetails,
  updateSubscription,
  updateAvatar,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { sendOTPEmail } from "../controllers/sendOTP.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/send-otp").post(sendOTPEmail);
router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJWT, logOutUser);
router.route("/refresh_token").post(refreshAccessToken);
//router.route("/change_password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/subscribe").put(verifyJWT, updateSubscription);

//patch
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

router
  .route("/update-avatar")
  .post(verifyJWT, upload.single("avatar"), updateAvatar);

export default router;
