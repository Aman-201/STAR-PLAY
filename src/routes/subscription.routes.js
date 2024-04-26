import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { getUserChannelSubscribers, toggleSubscription ,getSubscribedChannels} from "../controllers/subscription.controller.js";
const router=Router();
router.route("/toggle-subscription/:channelId").post(verifyJwt,toggleSubscription);
router.route("/channel-subscribers/:channelId").get(verifyJwt,getUserChannelSubscribers);
router.route("/channel-subscribed/:subscriberId").get(verifyJwt,getSubscribedChannels);
export default router