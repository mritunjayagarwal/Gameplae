const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const compression = require('compression');
const helmet = require('helmet');
const http = require('http');
const container = require('./container');
const paypal = require('paypal-rest-sdk');
require('dotenv').config();

container.resolve(function(users, tournament, wallet, payouts,winners, _){

    // paypal.configure({
    //     'mode': 'sandbox', //sandbox or live
    //     'client_id': 'Aaeq-bLvikR2XR3ApZJxUZaztzhaz9uPeOqrPt6PEeOtB5V6baiDyD6Y15lXPb1JrGKk61Y3llX30Wbv',
    //     'client_secret': 'EBbiock5dGv_1y0k7MpgaQ2g6ocGOBHATSskzTZjv3zOU2bTznMxJyX0ltxlhOD4Y48h6fjMxeFOUDdO'
    //   });

    mongoose.Promise = global.Promise;
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true})

    const app = ShowExpress();

    function ShowExpress(){
        const app = express();
        const server = http.createServer(app);
        const port = 8000;

        configureExpress(app);

        server.listen(process.env.PORT || port, function(err){
            if(err) console.log(err);
            console.log("Gameplae! Lets Plae ");
        });

        const router = require('express-promise-router')();
        users.SetRouting(router);
        wallet.SetRouting(router);
        tournament.SetRouting(router);
        payouts.SetRouting(router);
        winners.SetRouting(router);

        app.use(router);

        app.use(function(req, res){
            res.render('404');
        })

    }

    function configureExpress(app){

        app.use(compression());
        app.use(helmet());

        require('./passport/signup');
        require('./passport/login');

        app.use(express.static('public'));
        app.use(cookieParser());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true}));
        app.use(expressValidator());
        app.use(session({
            secret: process.env.SECRET_KEY,
            resave: true,
            saveUninitialized: true,
            cookie : {
                maxAge: 1000* 60 * 60 *24 * 365
            },
            store: new MongoStore({ mongooseConnection: mongoose.connection})
        }));

        app.use(flash());       
        app.use(passport.initialize());
        app.use(passport.session());

        app.set('view engine', 'ejs');
        app.locals._ = _;
    }
})