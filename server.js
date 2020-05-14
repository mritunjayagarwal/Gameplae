const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const http = require('http');
const container = require('./container');

container.resolve(function(users, tournament, _){

    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://bigmoney:Zoniackk3@ds251618.mlab.com:51618/slingshot', { useNewUrlParser: true, useUnifiedTopology: true})

    const app = ShowExpress();

    function ShowExpress(){
        const app = express();
        const server = http.createServer(app);
        const port = 8000;

        configureExpress(app);

        server.listen(port, function(err){
            if(err) console.log(err);
            console.log("SlingShot is Up and Running");
        });

        const router = require('express-promise-router')();
        users.SetRouting(router);
        tournament.SetRouting(router);

        app.use(router);
    }

    function configureExpress(app){

        require('./passport/signup');
        require('./passport/login');

        app.use(cookieParser());
        app.use(express.static('public'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true}));
        app.use(session({
            resave: true,
            saveUninitialized: true,
            secret: 'mommy',
            store: new MongoStore({ mongooseConnection: mongoose.connection})
        }));
        app.use(flash());        
        app.use(passport.initialize());
        app.use(passport.session());

        app.set('view engine', 'ejs');

        app.locals._ = _;
    }
})