
module.exports = function(_, Game, User, passport, Tournament){
    return {
        SetRouting: function(router){
            router.get('/', this.indexPage);
            router.get('/tournaments/:id', this.new);
            router.get('/admin', this.admin);
            router.get('/signup' ,this.signup);
            router.get('/logout', this.logout);
            router.get('/home', this.home);
            router.get('/login', this.login);
            router.get('/join/tournament/:id', this.joinTournament);

            router.post('/add', this.add);
            router.post('/signup', this.createAccount);
            router.post('/login', this.getInside);
        },
        indexPage: function(req, res){
                res.render('index');
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

            async function Hey(callback){
                const game = await Game.findOne({ name: req.params.id}).populate({ path: 'tournaments', model: 'Tournament'}).exec();
                console.log(game);
                tournaments = game.tournaments;
                res.render('new', { game: game, tournaments: tournaments});
            }

            Hey();
        },
        admin: function(req, res){
            res.render('admin');
        },
        add: function(req, res){
            console.log('New Game Insertion in Progres...');
            const newGame = new Game();
            newGame.name = req.body.name;
            newGame.pname = req.body.pname;
            newGame.description = req.body.desc;
            newGame.cover = req.body.cover;
            newGame.face = req.body.face;
            newGame.save(function(err){
                if(err) console.log(err);
                console.log("New Game Insertion Success!");
                res.redirect('/admin')
            })
        },
        signup: function(req, res){
            res.render('signup');
        },
        createAccount: passport.authenticate('local.signup', {
            successRedirect: '/home',
            failureRedirect: '/',
            failureFlash: true
        }),
        logout: function(req, res){
            req.logout();
            res.redirect('/');
        },
        home: function(req, res){
            res.render('home', {user: req.user});
        },
        login: function(req, res){
            res.render('login');
        },
        getInside: passport.authenticate('local.login', {
            successRedirect: '/home',
            failureRedirect: '/',
            failureFlash: true
        }),
        joinTournament: function(req, res){
            console.log(req.params.id)
            if(req.user){
                console.log("User Session is Working Okay!!");
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
                    _id: tourId
                }, {
                    $push: {
                        players: { user: req.user._id}
                    }
                }, (err) => {
                    console.log("Tournament Set To fuck GamingMong");
                });

                res.redirect('/show/tournament/' + tourId);

            }else{
                res.render('signup');
            }
        }
    }    
}