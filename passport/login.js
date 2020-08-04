const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
});

passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({'email': email}, (err, user) => {
        if(err){
            return done(err);
        }

        const messages = []
        if(!user || !user.compare(password)){
            messages.push('Email Does not exist or password does not match');
            return done(null, false, req.flash('error', messages));
        }

        User.updateOne({
            _id: user._id
        }, {
            $set: {
                "lastlogin": new Date()
            }
        }, (err) => {
            if(err){
                req.flash("error", "Something went wrong.Please Try again")
            } 
            return done(null, user);
        })
    })
}))

