const mongoose = require('mongoose');

const urlMongo = process.env.MONGO_URL;

const conecctDataBase = async () => {
    try {
        await mongoose.connect(urlMongo);
        console.log("successful connection with MongoDB");
    } catch (error) {
         console.log('Error connecting to MongoDB');
    }
};

module.exports = conecctDataBase;