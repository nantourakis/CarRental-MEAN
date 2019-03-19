const express = require('express');
const path = require('path');

// to use express, cors &and body-parser
const app = express();
const cors = require('cors');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

// mongo url
const uri = 'mongodb+srv://niko:GE3I4Pdaw1byGD8p@cluster0-ufbjh.mongodb.net/test?retryWrites=true';

// Connection to mongoDB cluster
mongoose.connect(uri, {useNewUrlParser: true}).then(() => {
    console.log('Connected')
}).catch(err => console.log(err));

app.use(cors());
app.use(bodyparser.json());

// gives angular access to our uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// TESTING COMPINED APP DEPLOYMENT
// app.use('/', express.static(path.join(__dirname, 'angular')));

const userRoutes = require('./user');
const adminRoutes = require('./admin');
// so you don't need to type in /api/user everytime when routing
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// TESTING COMPINED APP DEPLOYMENT - serving html file from our backend
//app.use((req, res, next) => {
    //res.sendFile(__dirname, 'angular', 'index.html');
//});

//connect this app to our server "server.js file"
module.exports = app;