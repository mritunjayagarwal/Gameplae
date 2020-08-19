module.exports = function(_, Tournament, async, Game, User, moment){
    return {
        SetRouting: function(router){
            router.get('/gettournament', this.getTournament);
            router.get('/tournament/:id', this.tournamentInfo);
            router.get('/show/tournament/:id', this.showTournament);

            router.post('/create/tournament', this.createTournament)
        },
        getTournament: function(req, res){
            if(req.user){
                Game.find({})
                .sort('-name')
                .exec((err, game) => {
                    res.render('createtournament', { games: game});
                });
            }else{
                res.render('login');
            }
        },
        createTournament: function(req, res){
            if(req.user){
                async.waterfall([
                    function(callback){
                        Game.findOne({'name': req.body.game}, (err, user) => {
                            if(err){
                                // console.log(err);
                                res.redirect('/getTournament');
                            }else{
                                console.log(user._id)
                                global.gameId = user._id;
                                callback(err, gameId)
                            }
                        })
                    },
                    function(gameId, callback){
                        const newTournament = new Tournament();
                        newTournament.game = gameId;
                        newTournament.name = req.body.name;
                        newTournament.owner = req.user._id;
                        newTournament.desc = req.body.desc;
                        newTournament.price = req.body.price;
                        newTournament.participants = req.body.participants;
                        newTournament.starts = req.body.starts;
                        newTournament.eclosing = req.body.eclosing;
                        newTournament.ends = req.body.ends;
                        newTournament.save(function(err){
                            // if(err) console.log(err);
                            console.log("Success");
                            callback(err, newTournament);
                        })
                    }, function(newTournament, callback){
                        Game.update({
                            '_id': gameId
                        }, {
                            $push: {
                                tournaments: newTournament._id
                            }
                        }, (err, count) => {
                            callback(err, count);
                            res.redirect('/');
                        })
                    }
                ])
            }else{ 
                console.log('User login is required to create a tournament!');
                res.render('login');
            }
        },
        tournamentInfo: async function(req, res){
                const games = await Game.find({}).sort('-name').populate('tournaments').exec();
                const tournament = await Tournament.findOne({ _id: req.params.id}).populate({ path: 'game', model: 'Game'}).populate({ path: 'players.user', model: 'User'}).populate({ path: 'winners.user', model: 'User'}).exec();
                if(req.user){
                    var user = await User.findOne({ _id: req.user._id}).populate({ path: 'pay', model: 'Wallet'}).exec();
                    var upi = user.pay.upi
                }else{
                    var user = '';
                    var upi = ''
                }
                const errors = req.flash('error');
                const success = req.flash('success');
                const uInvalid = req.flash('userInvalid');
                res.render('tournament', { tournament: tournament, games: games, user: user, moment: moment, user: req.user, errors: errors, hasErrors: errors.length > 0, pay: user.pay, successMsg: success.length > 0, success: success, upi: upi, messages: uInvalid, isPre: uInvalid.length > 0});
        },
        showTournament: function(req, res){
            console.log(req.params.id);

            async function Extract(callback){
                const game = await Tournament.findOne({ _id: req.params.id}).populate({ path: 'players.user', model: 'User'}).exec();
                const player = game.players;
                console.log(player);
                res.render('showTournament', { game: game, players: player, moment: moment});
            }

            Extract();
        }
    }
}