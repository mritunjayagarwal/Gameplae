module.exports = function(User, Tournament, Game, async){
    return {
        SetRouting: function(router){
            router.get('/enterid', this.enterTournament);
            router.post('/evaluatewinner', this.evaluatewinner);
            router.post('/winsub/:id', this.winsub);
        },
        enterTournament: async function(req, res){
            const tournaments = await Tournament.find({}).sort('-created').exec();
            res.render('entertour', {tournaments: tournaments});
        },
        evaluatewinner: async function(req, res){
            const tournament = await Tournament.findOne({ _id: req.body.tid}).populate({ path: 'game', model: 'Game'}).populate({ path: 'players.user', model: 'User'}).populate({ path: 'winners.user', model: 'User'}).exec();
            if(tournament){
                const players = tournament.players;
                const winners = tournament.winners;
                res.render('winners', {tournament: tournament, players: players, winners: winners});
            }else{
                console.log("No tournament Found");
                res.redirect('/enterid')
            }
        },
        winsub: async function(req, res){
            Tournament.findOne({ _id: req.params.id}, (err, tour) => {
                if(tour){
                    Tournament.updateOne({
                        _id: req.params.id,
                        "winners.user":  { '$ne': req.body.wid}
                    }, {
                        $push: {
                            winners: { user: req.body.wid, name: req.body.winame, username: req.body.wuname, position: req.body.wposition, won: req.body.wamount}
                        }
                    }, (err) => {
                        if(err){
                            req.flash("error", "An error has occured while processing your request" + err);
                            res.redirect('/enterid')
                        }else{
                            console.log("Successssssss")
                            res.redirect("/enterid");
                            // res.writeHead(307, { Location : req.url });
                            // res.end();
                        }
                    })
                }
            })
        }
    }
}