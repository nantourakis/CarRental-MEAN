//our endpoints

const express = require('express');

// multer allows us to better handle form data and upload images / create a folder called uploads 
const multer = require('multer');

// we use router for our get and post requests
const router = express.Router();

// require car module
const Car = require('./models/car');

// require user mongo schema
const User = require('./models/user');

// import reservation model
const Reservation = require('./models/reservation');


const storage = multer.diskStorage({
    // where to save our images (3 arguments, cb is from multer documentation)
    destination: function (req, file, cb) {
        //path to our images, updating contents within the backend folder but not the folder itself when deployed
        cb(null, 'uploads') 
    },
    // for the pics to get uploaded to the uploads folder with their original name
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({
    //saving the storage
    storage: storage
});

// use our router to define endpoint, post request then 
router.post('/save-image', upload.array('file'), (req, res) => {
    res.status(201).json({message: 'image uploaded'});
});

router.post('/create-car', (req, res, next) => {

    const url = req.protocol + '://' + req.get('host');

    const car = new Car({
        brand: req.body.brand, 
        model: req.body.model,
        power: req.body.power,
        seats: req.body.seats,
        imgUrl: url + '/uploads/' + req.body.imgUrl
    });

    // save to mongo
car.save().then(response => {
    res.status(201).json({message: 'Car is created'});
    //catch error if response fails
}).catch(error => {
    console.log(error);
});
});

//router
router.get('/users', (req, res, next) => {
    // user module - return all the users and take the email only isAdmin if found
    User.find({}, 'email isAdmin').then(user =>{
        if(!user) {
            res.status(404).json({message: 'No users founds'});
        }
        // if we have users
        res.status(200).json(user);
    }).catch(error => {
        console.log(error);
    });
});

// delete User
router.post('/delete-user', (req, res, next) => {
    // call User model and deleteOne is a mongo . find email that matches our email and delete
    User.deleteOne({email: req.body.email}).then(res1 => {
        // delete the user then return all other users back
        User.find().then(users => {
            res.status(201).json(users);
        }).catch(error => {console.log(error)});
    }).catch(error => {console.log(error)});
});

// make admin
router.post('/admin-user', (req, res) => {
    // findoneandupdate is a mongo function, find user with same email / update to admin. admin = 1
    User.findOneAndUpdate({email: req.body.email}, {$set: {isAdmin: 1}}, {new: true}).then(user => {
        // find / search for users again and return a promise if everything okay
        User.find().then(users => {
            res.status(200).json(users);
        }).catch(error => {console.log(error)});
    }).catch(error => {console.log(error)});
});

router.post('/cars', (req, res) => {
    // 1st case, find either of these cars then return finding (3 ends with atleast 1 to be true)
    // user from date to be between the reserved from and until date
Reservation.find().or([ {$and: [{from: {$lte: req.body.from}}, {until: {$gte: req.body.from}}]},
    // 2nd case - or user until date to be between the reserved from and until date
    {$and: [ {from: {$lte: req.body.until}}, {until: {$gte: req.body.until}}]},
    // 3rd case - or user from date to be less than from reserved and greater than the reserved until date
     {$and: [ {from: {$gt: req.body.from}}, {until: {$lt: req.body.until}}]}
     //returns a promise
    ]).then(cars => {
        // if we dont find any rserved cars then return all cars back 
        if(cars[0] === undefined) {
            Car.find().then(car => {
                res.status(200).json(car);
            }).catch(error => console.log(error));
        } else {
            // case if we have a reserved car, catch the id and return all the cars except for the one we found
            Car.find({_id: {$ne: cars[0].car_id}}).then(car3 => {
                res.status(201).json(car3);
            }).catch(error => {console.log(error)});
        }
    })
    });

    // finish our endpoint to rent cars
    router.post('/rent', (req, res) => {
        // Reservation is our Mongo model
        const reserve = new Reservation({
            //getting from angular request
            car_id: req.body.id,
            from: req.body.from,
            until: req.body.until,
            fromDate: req.body.fromDate,
            untilDate: req.body.untilDate
        });
        // to save our rented car to our database
        reserve.save().then(response => {
            res.status(200).json({message: 'Car Rented!'});
        }).catch(error => {
            console.log(error);
        })
    });

    // get request to display rented cars to table
    router.get('/rented-cars', (req, res) => {
        // mongo reservation schema to find all cars that are reserved
        Reservation.find().then(rented => {
            res.status(200).json(rented);
        }).catch(error => {
            console.log(error);
        })
    });

    // cancel reservations endpoints
    router.post('/cancel-rent', (req, res) => {
        // deleteOne is from mongoose - state what we want to delete.
        // delete our car_id if it matches req etc.. - then return a promise with our new cars
        Reservation.deleteOne({car_id: req.body.id, fromDate: req.body.from, untilDate: req.body.until}).then( cars => {
            res.status(200).json(cars);
        }).catch(error => {
            console.log(error);
        });
    });


//export router in order to use it
module.exports = router;

