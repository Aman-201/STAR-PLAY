import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {createTweet,updateTweet,deleteTweet, getUserTweets} from '../controllers/tweet.controller.js'
const router=Router();
router.route("/create-tweet").post(verifyJwt,createTweet);
router.route("/update-tweet/:tweetId").post(verifyJwt,updateTweet);
router.route("/delete-tweet/:tweetId").post(verifyJwt,deleteTweet);
router.route("/user-tweets").get(verifyJwt,getUserTweets);
export default router;