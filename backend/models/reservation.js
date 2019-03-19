const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create reservation Schema
const reservationSchema = mongoose.Schema({
// our model, looking for ID from our ref "Car model"
    car_id: {type: Schema.Types.ObjectId, ref: 'Car'},
    from: Number,
    until: Number,
    fromDate: Date,
    untilDate: Date

});

// export our Schema. name it reservtion which is our reversationSchema
module.exports = mongoose.model('Reservation', reservationSchema);