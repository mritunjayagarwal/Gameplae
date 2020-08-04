const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const Wallet = require('../models/wallet');
const nodemailer = require("nodemailer");

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})

passport.use('local.signup', new LocalStrategy({
    usernameField: 'name',
    passwordField: 'password',
    passReqToCallback: true
}, (req, name, password, done) => {
    User.findOne({'name': name}, (err, user) => {
        if(err){
            console.log(err);
            return done(null, false, req.flash('error', 'Weak Connectivity'));
        }

        if(user){
            return done(null, false, req.flash('error', 'User already exists'));
        }

        const newWallet = new Wallet();
        const newUser = new User();
        newUser.name = req.body.name;
        newUser.email = req.body.email;
        newUser.phone = req.body.tel;
        newUser.pay = newWallet._id;
        newUser.password = newUser.encryptPassword(req.body.password);
        newWallet.owner = newUser._id;
        newWallet.holder = newUser.name;
        newWallet.phone = newUser.phone;

        newWallet.save(() => {
            console.log("Wallet Details Added Successfully");
        });
        
        newUser.save(function(err){
            if(err) console.log(err);
            return done(null, newUser);
        });
    })
}));

