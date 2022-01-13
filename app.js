
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const { initialize } = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// place here..
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model('user', userSchema);

passport.use(User.createStrategy());

// local serializing - doesn't work with OAuth
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// Any autentication
passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
function(accessToken, refreshToken, profile,  cb){
    User.findOrCreate({googleId: profile.id}, function(err, user){
        console.log(profile);
        return cb(err, user);
    });
}));


app.get('/', function (req, res) {
    res.render("home")
});

app.get('/auth/google',
    passport.authenticate("google", {scope: ["profile"]})
);

app.get('/auth/google/secrets',
    passport.authenticate('google', {failureRedirect: '/login'}),
    function(req, res) {
        res.redirect('/secrets');
    }
)

// Register route
app.route('/register')

    .get(function (req, res) {
        res.render("register")
    })

    .post(function (req, res) {
        User.register({ username: req.body.username }, req.body.password, function (err, user) {
            if (err) {
                console.log(err);
                res.redirect("/register");
            } else {
                passport.authenticate("local")(req, res, function () {
                    res.redirect("/secrets");
                });
            }
        });
    });

// Secrets route
app.route('/secrets')

.get(function(req, res){
    if(req.isAuthenticated()) {
        res.render('secrets');
    } else {
        res.redirect('/login');
    }
});

// Login route
app.route('/login')

    .get(function (req, res) {
        res.render("login")
    })

    .post(function (req, res) {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        });

        req.login(user, function(err) {
            if(err) {
                console.log(err);
            } else {
                passport.authenticate("local")(req, res, function(){
                    res.redirect("/secrets");
                });
            }
        })
    });

app.route('/logout')

.get(function(req, res){
    req.logout();
    res.redirect('/');
});









app.listen(3000, function () {
    console.log("Sever started successfully on port 3000...");
});