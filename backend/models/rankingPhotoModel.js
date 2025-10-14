const mongoose = require("mongoose")
const schema = mongoose.Schema

const  rankingPhotoSchema = new schema({
     user: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        image: {
            type: String,
            required: true
        },

        votes: {
             type:[mongoose.Schema.Types.ObjectId],
             ref: "User"
        },
        country: {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Country",
            required: true
        },
       year: {
            type: Number,
            default: new Date().getFullYear()
        }

       
})

const rankingPhotoModel = mongoose.model("RankingPhoto", rankingPhotoSchema, "rankingPhotos")

module.exports = rankingPhotoModel