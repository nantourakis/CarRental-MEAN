const mongoose = require('mongoose');

// Create mongo Schema
const userSchema = mongoose.Schema({

    email: String,
    password: String,
    isAdmin: Number
});

module.exports = mongoose.model('User', userSchema);

