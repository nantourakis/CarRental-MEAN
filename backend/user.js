const express = require('express');
const router = express.Router();

// get mongp schema from user model
const User = require('./models/user');

// used to hash passwords
const bcrypt = require('bcryptjs');

// hash user info withen a token
const jwt = require('jsonwebtoken');

// Register user Logic
router.post('/signup', (req, res, next) => {
    //res.status(200).json({message: 'Response from NodeJS'});
    // using bcrypt to hash password, # = strengh hash password
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash,
            // 1 is an Admin, users are 0
            isAdmin: 0
        });
        // save to datebase
        user.save().then(result => {
            res.status(201).json({message: 'User Created'});
        }).catch(error => {
            console.log(error);
        });
    });
});

router.post('/login', (req, res, next) => {
    let fetcheduser;
    User.findOne({email: req.body.email}).then(user => {
        fetcheduser = user;
        if(!user) {
            return res.status(404).json({message: 'Auth Failed'});
        }
       return bcrypt.compare(req.body.password, user.password)
    }).then(result => {
        if(!result) {
            res.status(404).json({message: 'Auth Failed'});
        }
        const administrator = fetcheduser.isAdmin;
        // passing in secret password and when token expires
        const token = jwt.sign({email: fetcheduser.email, userId: fetcheduser._id}, 'secret-long', {expiresIn: '1h'});
        // returns back a token witht the below inputs
        res.status(200).json({token: token, expiresIn: 3600, admin: administrator});
    }).catch(err => {
        console.log(err);
    });
});

module.exports = router;