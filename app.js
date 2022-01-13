
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
// const encrypt = require('mongoose-encryption');
// const sha1 = require('sha1');
// can use md5 too
const bcrypt = require('bcrypt');
const saltRounds = 16;

const app = express();

// console.log(sha1("test4"));

app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// Caeser cipher
// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model('user', userSchema);

app.get('/', function(req, res){
    res.render("home")
});


// Register route
app.route('/register')

.get(function(req, res){
    res.render("register")
})

.post(function(req, res){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash){
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save(function(err){
            if(!err) {
                res.render('secrets');
            } else {
                console.log(err);
            }
        });
    });
});


// Login route
app.route('/login')

.get(function(req, res){
    res.render("login")
})

.post(function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundUser){
        if(err) {
            console.log(err);
        } else {
            if(foundUser) {
                bcrypt.compare(password, foundUser.password, function(err, result){
                    if(result === true) {
                        res.render('secrets');
                    }
                });
            }
        }
    });
});











app.listen(3000, function(){
    console.log("Sever started successfully on port 3000...");
});