import { Router } from "express";
import { getVideoById, publishVideo, updateVideo, deleteVideo, getAllVideos} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router=Router();
router.route("/publish-video").post(verifyJwt,upload.fields([{name:'thumbnail',maxCount:1},{name:'videoFile',maxCount:1}]),publishVideo);
router.route("/get-video/:videoId").get(getVideoById)
router.route("/update-video/:videoId").patch(upload.fields([{name:'thumbnail',maxCount:1},{name:'videoFile',maxCount:1}]),updateVideo)
router.route("/delete-video/:videoId").get(deleteVideo)
router.route("/all-videos/:userId").get(getAllVideos);
export default router;