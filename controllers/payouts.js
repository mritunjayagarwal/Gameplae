module.exports = function(User, Wallet){
    return {
        SetRouting: function(router){
            router.get('/payoutAdmin', this.payoutAdmin);
            router.get('/check/:uid/process/:wid/:hid', this.processPayment);
        },
        payoutAdmin: async function(req, res){
            const wallets = await Wallet.find({"history.processing": true}).populate({path: 'owner', model: 'User'}).exec();
            res.render('payout', { wallets: wallets})
        },
        processPayment: async function(req, res){
            console.log(req.params.uid);
            console.log(req.params.wid);
            console.log(req.params.hid);
            Wallet.find({"_id": req.params.wid, "history._id": req.params.hid, "history.processing": true}, (err, wallet) => {
                if(wallet){
                    console.log("Wallet Found Successfully");
                    console.log(wallet);
                    Wallet.updateOne({
                        "_id": req.params.wid, 
                        "history._id": req.params.hid
                    }, {
                        $set: {
                            "history.$.processing": false
                        }
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