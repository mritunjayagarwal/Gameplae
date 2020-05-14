module.exports = function(_, Tournament, async, Game, User, moment){
    return {
        SetRouting: function(router){
            router.get('/gettournament', this.getTournament);
            router.get('/test', this.test);
            router.get('/tournament/:id', this.tournamentInfo);
            router.get('/show/tournament/:id', this.showTournament);

            router.post('/create/tournament', this.createTournament)
        },
        getTournament: function(req, res){
            res.render('createtournament');
        },
        createTournament: function(req, res){
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
                    newTournament.participants = req.body.participants;
                    newTournament.starts = req.body.starts;
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
        },
        test: function(req, res){
            async function Hey(callback){
                const game = await Game.findOne({ name: 'god of war'}).populate({ path: 'tournaments', model: 'Tournament'}).exec();
                console.log(game);
                res.redirect('/');
            }

            Hey();
        },
        tournamentInfo: function(req, res){
            id = req.params.id;
            // Tournament.findOne({ _id: id}, (err, user) => {
            //     if(err){
            //         res.redirect('/');
            //     }
            //     if(user){
            //         console.log(user);
            //         res.render('tournament', {tournament: user});
            //     }
            // })
            async function Hey(callback){
                const tournament = await Tournament.findOne({ _id: req.params.id}).populate({ path: 'game', model: 'Game'}).exec();
                console.log(tournament);
                res.render('tournament', {tournament: tournament, moment: moment});
            }

            Hey();
        },
        showTournament: function(req, res){
            console.log(req.params.id);

            async function Hey(callback){
                const game = await Tournament.findOne({ _id: req.params.id}).populate({ path: 'players.user', model: 'User'}).exec();
                const player = game.players;
                console.log(player);
                res.render('showTournament', { game: game, players: player, moment: moment});
            }

            Hey();
        }
    }
}