const express = require("express");
const router = express.Router();

const{createPhoto, addVoteAndDeleteVote, obtainedAllPhoto} = require("../controllers/rankingPhotoController");
const { verification } = require("../middelwares/middelwareAuthentication");

router.get("/allphotos", verification, obtainedAllPhoto)
router.post("/create", verification, createPhoto)
router.post("/:photoId",verification, addVoteAndDeleteVote)

module.exports = router