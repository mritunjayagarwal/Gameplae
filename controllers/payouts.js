module.exports = function(User, Wallet){
    return {
        SetRouting: function(router){
            router.get('/payoutAdmin', this.payoutAdmin);
            router.get('/check/:uid/process/:wid/:amount/:hid', this.processPayment);
        },
        payoutAdmin: async function(req, res){
            const wallets = await Wallet.find({"history.processing": true}).populate({path: 'owner', model: 'User'}).exec();
            res.render('payout', { wallets: wallets})
        },
        processPayment: async function(req, res){
            Wallet.find({"_id": req.params.wid, "history._id": req.params.hid, "history.processing": true}, (err, wallet) => {
                if(wallet){
                    console.log("Wallet Found Successfully");
                    Wallet.updateOne({
                        "_id": req.params.wid, 
                        "history._id": req.params.hid
                    }, {
                        $inc: { balance: -(req.params.amount)},
                        $set: {"history.$.processing": false, "history.$.processed": new Date()}
                    }, (err) => {
                        console.log("Success");
                    })
                    res.redirect('/payoutAdmin')
                }else{
                    console.log("Fuck ho gya yrr");
                    res.redirect('/payoutAdmin')
                }
            })
        }
    } 
}