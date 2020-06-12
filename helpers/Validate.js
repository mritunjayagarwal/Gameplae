'use strict';

module.exports = function(_){
    return {
        SignUpValidation: function(req, res, next){
            req.checkBody('name', "You are required to enter your full name").isEmpty();
            req.checkBody('email', "You are required to enter your email").isEmpty();
            req.checkBody('password', "You are required to enter your password").isEmpty();
            req.checkBody('tel', "You are required to enter your phone number").isEmpty();

            req.getValidationResult()
            .then((result) => {
                const errors = result.array();
                const messages = [];
                errors.forEach((error) => {
                    messages.push(error.msg);
                });

                req.flash('error', messages);
                res.redirect('/signup');
            })
            .catch((err) => {
                return next();
            })
        }
    }
}