// Mongo DB database collection
const mongoose = require('mongoose');

const carSchema = mongoose.Schema({
    
    brand: String,
    model: String,
    power: String,
    seats: Number,
    imgUrl: String,

});

// Car is now carSchema
module.exports = mongoose.model('Car', carSchema);