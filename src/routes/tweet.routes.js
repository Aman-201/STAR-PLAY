import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {createTweet,updateTweet,deleteTweet} from '../controllers/tweet.controller.js'
const router=Router();
router.route("/create-tweet").post(verifyJwt,createTweet);
router.route("/update-tweet/:tweetId").post(verifyJwt,updateTweet);
router.route("/delete-tweet/:tweetId").post(verifyJwt,deleteTweet);
export default router;