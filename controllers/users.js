module.exports = function(_, Game, User, passport, Tournament, paypal, moment, rug, Validate){
    return {
        SetRouting: function(router){
            router.get('/', this.indexPage);
            router.get('/tournaments/:id', this.new);
            router.get('/admin', this.admin);
            router.get('/signup' , Validate.SignUpValidation, this.signup);
            router.get('/logout', this.logout);
            router.get('/home', this.home);
            router.get('/login', this.login);
            router.get('/join/tournament/:id/:uname', this.joinTournament);
            router.get('/success/:id', this.success);

            router.post('/add', this.add);
            router.post('/payment/:id', this.payment);
            router.post('/signup', this.createAccount);
            router.post('/login', this.getInside);
        },
        indexPage: function(req, res){

                var game = Game.find({})
                .sort('-name')
                .populate('tournaments')
                .exec((err, game) => {
                    res.render('index', { games: game, user: req.user, moment: moment, user: req.user});
                });
        },
        new: function(req, res){
            // var something = req.params.id;
            // Game.findOne({ 'name': something}, function(err, user){
            //     if(err){
            //         console.log(err);
            //         res.redirect('/');
            //     }else{
            //         console.log(user.name);
            //         res.render('new', { game: user});
            //     }
            // })

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
                res.redirect('/gettournament')
            })
        },
        signup: function(req, res){
            const errors = req.flash('error');
            res.render('signup', { messages: errors, hasErrors: errors.length > 0});
        },
        createAccount: passport.authenticate('local.signup', {
            successRedirect: '/',
            failureRedirect: '/signup',
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
        login: function(req, res){
            res.render('login');
        },
        getInside: passport.authenticate('local.login', {
            successRedirect: '/',
            failureRedirect: '/login',
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
                        res.redirect('/tournament/' + req.params.id)
                    }
                })
            }else{
                res.render('login');
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
            console.log(req.params.id);
            console.log(req.params.uname);
            if(req.user){
                tourId = req.params.id;

                User.update({
                    _id: req.user._id
                }, {
                    $push: {
                        tournament: { tour: tourId}
                    }
                }, (err) => {
                console.log(req.user);
                });

                Tournament.update({
                    _id: tourId,
                    'players.username': { '$ne': req.params.uname}
                }, {
                    '$addToSet': {
                        players: { user: req.user._id, username: req.params.uname}
                    }
                }, (err) => {
                    console.log("Tournament Set To fuck GamingMonK");
                });

                res.redirect('/show/tournament/' + tourId);

            }else{
                res.render('signup');
            }
        }
    }    
}