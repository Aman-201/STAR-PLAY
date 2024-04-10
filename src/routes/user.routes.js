import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser, changePassword, getCurrentUser, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getUserWatchHistory } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router=Router();
console.log("inside routes")
router.route("/register").post(upload.fields([{name:'avatar',maxCount:1},{name:'coverImage',maxCount:1}]),registerUser)
router.route("/login").post(loginUser);
//secured routes
router.route("/logout").post(verifyJwt,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJwt,changePassword);
router.route("/current-user").get(verifyJwt,getCurrentUser);
router.route("/update-account").patch(verifyJwt,changePassword);
router.route("/update-avatar").post(verifyJwt,upload.single("avatar"),updateUserAvatar);
router.route("/update-coverimage").post(verifyJwt,upload.single("coverImage"),updateUserCoverImage);
router.route("/channel/:username").get(verifyJwt,getUserChannelProfile);
router.route("/watch-history").get(verifyJwt,getUserWatchHistory);
export default router;