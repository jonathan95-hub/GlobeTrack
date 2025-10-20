const express = require("express");
const router = express.Router();

const{createPhoto, addVoteAndDeleteVote, obtainedAllPhoto, deletePhoto} = require("../controllers/rankingPhotoController");
const { verification } = require("../middelwares/middelwareAuthentication");

router.get("/allphotos", verification, obtainedAllPhoto)
router.post("/create", verification, createPhoto)
router.post("/:photoId",verification, addVoteAndDeleteVote)
router.delete("/delete/:photoId", verification, deletePhoto)

module.exports = router