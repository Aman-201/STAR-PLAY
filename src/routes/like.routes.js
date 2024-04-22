import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";

const router=Router();

router.route("/toggle-video-like/:videoId").post(verifyJwt,toggleVideoLike);
router.route("/toggle-comment-like/:commentId").post(verifyJwt,toggleCommentLike);
router.route("/toggle-tweet-like/:tweetId").post(verifyJwt,toggleTweetLike);
export default router;