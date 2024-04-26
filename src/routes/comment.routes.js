import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { addComments, deleteComments, getVideoComments, updateComments } from "../controllers/comment.controller.js";
const router=Router()
console.log("inside comment routes")
router.route("/add-comment/:videoId").post(verifyJwt,addComments);
router.route("/update-comment/:commentId").patch(verifyJwt,updateComments);
router.route("/delete-comment/:commentId").get(verifyJwt,deleteComments);
router.route("/get-video-comments/:videoId").get(verifyJwt,getVideoComments);
export default router;