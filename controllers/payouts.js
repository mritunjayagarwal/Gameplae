module.exports = function(User, Wallet){
    return {
        SetRouting: function(router){
            router.get('/payoutAdmin', this.payoutAdmin);
        },
        payoutAdmin: async function(req, res){
            const users = await Wallet.find({processing: false}).populate({ path: 'owner', model: 'User'}).exec();
            console.log(users);
            res.render('payout', { users: users})
        }
    }
}