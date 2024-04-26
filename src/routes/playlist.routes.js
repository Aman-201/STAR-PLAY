import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, deleteVideoFromPlaylist, getPlaylistById, getUserPlaylists, updatePlaylist } from "../controllers/playlist.controller.js";
const router=Router();
router.route("/create-playlist").post(verifyJwt,createPlaylist)
router.route("/get-playlist/:playlistId").post(verifyJwt,getPlaylistById)
router.route("/delete-playlist/:playlistId").post(verifyJwt,deletePlaylist)
router.route("/add-video-to-playlist/:playlistId/:videoId").post(verifyJwt,addVideoToPlaylist)
router.route("/delete-video-from-playlist/:playlistId/:videoId").post(verifyJwt,deleteVideoFromPlaylist)
router.route("/update-playlist/:playlistId").post(verifyJwt,updatePlaylist)
router.route("/user-playlist/").get(verifyJwt,getUserPlaylists);
export default router