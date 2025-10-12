const countryModel = require("../models/countryModel");
const usersModel = require("../models/userModels");

const addCountry = async (req, res) => {
    try {
        const {name, geoJson} = req.body
        const isIncludes = await countryModel.findOne({name, geoJson})
        if(isIncludes){
            return res.status(400).send({status: "Failed", message: "Country already exists"})
        }

        const newCountry = await countryModel.create({name, geoJson})
        res.status(201).send({newCountry, status: "Success", message: "Country created"})
    } catch (error) {
        res.status(500).send({ status: "Failed", error: error.message });
    }
}

const deleteCountry = async (req, res) => {
    try {
        const countryId = req.params.countryId
        const deleteDataCountry = await countryModel.findByIdAndDelete(countryId)
        res.status(200).send({deleteDataCountry, status: "Success", message: "Country deleted"})
        
    } catch (error) {
        res.status(500).send({status: "Failed", error: error.message})
    }

}

const markVisited = async (req, res) => {
    try {
    const userId = req.payload._id
    const countryId = req.params.countryId

    const country = await countryModel.findById(countryId)
    if(!country){
        return res.status(404).send({status: "Failed", message: "Country not found"})
    }
    
    const isVisited = country.userVisited.includes(userId)

    if(isVisited){
        await countryModel.findByIdAndUpdate(countryId,{$pull: {userVisited: userId}})
        await usersModel.findByIdAndUpdate(userId,{$pull: {visitedDestinations: countryId}})
        return res.status(200).send({status: "Success", message: "country unmarked as visited"})
    }
    else{
        await countryModel.findByIdAndUpdate(countryId,{$addToSet: {userVisited: userId}})
        await usersModel.findByIdAndUpdate(userId,{$addToSet: {visitedDestinations: {geoId: country._id, name: country.name}}}, {new: true}).populate("visitedDestinations", "name")
        return res.status(200).send({status: "Success", message: "country marked as visited"})
    }
    } catch (error) {
          res.status(500).send({status: "Failed", error: error.message})
    }
}
module.exports = {addCountry, deleteCountry, markVisited}