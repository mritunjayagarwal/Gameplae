
module.exports = function(){
    return {
        SignupValidation: (req, res, next) => {
                req.checkBody('name', 'Name is required').notEmpty();
                req.checkBody('email', 'Email is required').notEmpty();
                req.checkBody('email', 'Enter a valid email').isEmail();
                req.checkBody('tel', 'Enter your phone').notEmpty();
                req.checkBody('password', 'Password is required').notEmpty();


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
                        next();
                    })
        },
        LogInValidation: (req, res, next) => {
            req.checkBody('email', 'Email is required').notEmpty();
            req.checkBody('email', 'Enter valid email').isEmail();
            req.checkBody('password', 'Password is required').notEmpty();


            req.getValidationResult()
                .then((result) => {
                    const errors = result.array();
                    const messages = [];
                    errors.forEach((error) => {
                        messages.push(error.msg);
                    });

                    req.flash('error', messages);
                    res.redirect('/login');
                })
                .catch((err) => {
                    next();
                })
        }
    }
}