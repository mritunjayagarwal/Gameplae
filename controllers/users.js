module.exports = function(_, Game, User, passport, Tournament, paypal, moment, rug, Validate, Razorpay){
    return {
        SetRouting: function(router){
            router.get('/', this.indexPage);
            router.get('/tournaments/:id', this.new);
            router.get('/admin', this.admin);
            router.all('/signup' , this.signup);
            router.get('/logout', this.logout);
            router.get('/home', this.home);
            router.get('/success/:id', this.success);
            router.get('/profile/:id', this.user);

            router.post('/add', this.add);
            router.post('/payment/:id', this.payment);
            router.post('/pay/:id/:uname', this.razorPay);
            router.post('/join/tournament', this.joinTournament);
            router.post('/api/payment/verify', this.razorVerify);
            router.post('/create', Validate.SignupValidation, this.createAccount);
            router.post('/login', Validate.LogInValidation, this.getInside);
        },
        indexPage: function(req, res){
                var game = Game.find({})
                .sort('-name')
                .populate('tournaments')
                .exec((err, game) => {
                    var errors = req.flash('error')
                    res.render('index', { games: game, user: req.user, moment: moment, user: req.user, messages: errors, hasErrors: errors.length > 0});
                });
        },
        new: function(req, res){

            async function Extract(callback){
                const game = await Game.findOne({ name: req.params.id}).populate({ path: 'tournaments', model: 'Tournament'}).exec();
                console.log(game);
                tournaments = game.tournaments;
                res.render('new', { game: game, tournaments: tournaments, moment: moment});
            }

            Extract();
        },
        admin: function(req, res){
            res.render('admin');
        },
        add: function(req, res){
            console.log('New Game Insertion in Progres...');
            const newGame = new Game();
            newGame.name = req.body.name;
            newGame.coverdesc = req.body.moto;
            newGame.description = req.body.desc;
            newGame.cover = req.body.cover;
            newGame.face = req.body.face;
            newGame.save(function(err){
                if(err) console.log(err);
                console.log("New Game Insertion Success!");
                res.redirect('/gettournament');
            })
        },
        signup: function(req, res){
            var errors = req.flash('error')
            res.render('signup', { messages: errors, hasErrors: errors.length > 0});
        },
        createAccount: passport.authenticate('local.signup', {
            successRedirect: '/',
            failureRedirect: '/',
            failureFlash: true
        }),
        logout: function(req, res){
            req.logout();
            res.redirect('/');
        },
        home: function(req, res){
            async function Extract(callback){
                const games = await Game.find({}).populate({ path: 'tournaments', model: 'Tournament'}).exec();
                res.render('home', { games: games, moment: moment});
            }

            Extract();
        },
        // login: function(req, res){
        //     var errors = req.flash('error')
        //     return res.render('login', { messages: errors, hasErrors: errors.length > 0});
        // },
        getInside: passport.authenticate('local.login', {
            successRedirect: '/',
            failureRedirect: '/',
            failureFlash: true
        }),
        payment: function(req, res){
            if(req.user){
                Tournament.findOne({  _id: req.params.id, 'players.username': { '$ne': req.body.username}}, (err, tour) => {
                    if(tour){
                        paypal.configure({
                            'mode': 'sandbox', //sandbox or live
                            'client_id': 'AS0y8Yz2qudO__ynIy-z55FmdxnOE41wFIlSPZuptK2Zcn2qwRpliuTzwAGCoR0RSYqWh3GKft_mP7Vq',
                            'client_secret': 'EDOBfxNiWwkj2YQZRl0SG8wm1gv9Q-R-QlJFMP8aAd9Lxrz5kSlRxPCMvglew8i_qHoNM_vjwZHezwFg'
                          });
            
                        var create_payment_json = {
                            "intent": "sale",
                            "payer": {
                                "payment_method": "paypal"
                            },
                            "redirect_urls": {
                                "return_url": "http://localhost:8000/join/tournament/" + req.params.id + "/" + req.body.username,
                                "cancel_url": "http://localhost:8000/cancel"
                            },
                            "transactions": [{
                                "item_list": {
                                    "items": [{
                                        "name": "Kill em",
                                        "sku": "My item",
                                        "price": "25.00",
                                        "currency": "INR",
                                        "quantity": 1
                                    }]
                                },
                                "amount": {
                                    "currency": "INR",
                                    "total": "25.00"
                                },
                                "description": "My Tournament Payment"
                            }]
                        };
                        
                        
                        paypal.payment.create(create_payment_json, function (error, payment) {
                            if (error) {
                                throw error;
                            } else {
                                for(let i = 0; i < payment.links.length; i++){
                                    if(payment.links[i].rel == 'approval_url'){
                                        res.redirect(payment.links[i].href);
                                    }
                                }
                                console.log(payment);
                            }
                        });
                    }else{
                        const messages = ['This username is already registered'];
                        req.flash('userInvalid', messages);
                        res.redirect('/tournament/' + req.params.id)
                    }
                })
            }else{
                req.flash('error', 'U\'ll have to login first');
                res.redirect('/login');
            }
        },
        success: function(req, res){
            const payerId = req.query.PayerID;
            const paymentId = req.query.paymentId;
            const tourId = req.params.id;

            const execute_payment_json = {
                "payer_id": payerId,
                "transactions": [{
                    "amount": {
                        "currency": "INR",
                        "total": "25.00"
                    }
                }]
              };

              paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
                if (error) {
                    console.log(error.response);
                    throw error;
                } else {
                    console.log(JSON.stringify(payment));
                    res.render('success', { tournament: tourId});
                }
            });
        },
        joinTournament: function(req, res){
            
            if(req.user){
                tourId = req.body.tournament;

                User.update({
                    _id: req.user._id
                }, {
                    $push: {
                        tournament: { tour: tourId}
                    }
                }, (err) => {
                    console.log("User Update Success");
                });

                Tournament.update({
                    _id: tourId,
                    'players.username': { '$ne': req.body.username}
                }, {
                    '$addToSet': {
                        players: { user: req.user._id, username: req.body.username}
                    }
                }, (err) => {
                    console.log("Tournament Set To fuck GamingMonK");
                });

                res.send({"status": "success"})

            }else{
                res.send({"status": "Please Signup"})
            }
        },
        razorPay: function(req, res){
            if(req.user){

                console.log(req.params.uname);

                Tournament.findOne({  _id: req.params.id, 'players.username': { '$ne': req.params.uname} }, (err, tour) => {
                       if(tour){

                        let instance = new Razorpay({
                            key_id: 'rzp_test_O1PrDYl7c0Fbi2', // your `KEY_ID`
                            key_secret: '7K2asMBdUb5RktmDCJ8WRxX3' // your `KEY_SECRET`
                        })                     

                        var params = {
                            amount: (tour.price) * 100,  
                            currency: "INR",
                            receipt: "su001",
                            payment_capture: '1'
                        };
                        instance.orders.create(params).then((data) => {
                                res.send({"sub":data,"status":"success"});
                        }).catch((error) => {
                                res.send({"sub":error,"status":"failed"});
                        })
                       }else{
                            res.send({"status":"failed"});
                       }
                });
            }
        },
        razorVerify: function(req, res){
            body=req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
            var crypto = require("crypto");
            var expectedSignature = crypto.createHmac('sha256', '7K2asMBdUb5RktmDCJ8WRxX3')
                                        .update(body.toString())
                                        .digest('hex');
            var response = {"status":"failure"}
            if(expectedSignature === req.body.razorpay_signature)
            response={"status":"success"}
            res.send(response);
        },
        user: function(req, res){
            async function Extract(callback){
                const games = await Game.find({}).exec();
                const user = await User.findOne({ _id: req.params.id}).populate({path: 'tournament.tour', model: 'Tournament'}).exec();
                res.render('user', {user: user, tournaments: user.tournament, games: games});
            }

            Extract();
        }
    }    
}