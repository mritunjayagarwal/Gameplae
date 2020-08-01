module.exports = function(User, Wallet){
    return {
        SetRouting: function(router){
            router.get('/payoutAdmin', this.payoutAdmin);
        },
        payoutAdmin: async function(req, res){
            const users = await Wallet.find({"history.processing": true}).populate({path: 'owner', model: 'User'}).exec();
            res.render('payout', { users: users})
        }
    } 
}