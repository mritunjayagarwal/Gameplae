module.exports = function(Wallet, User, async){
    return {
        SetRouting: function(router){
            router.post('/wrsubmit', this.wrSubmit);
        },
        wrSubmit: function(req, res){
            const newWallet = new Wallet();
            newWallet.owner = req.user._id;
            newWallet.upi.name = req.body.payThrough;
            newWallet.upi.rnum = req.body.upiNum;
            newWallet.save(() => {
                console.log("Wallet Details Added Successfully");
            });

            User.updateOne({
                _id: req.user._id
            }, {
                $push: {
                    pay: newWallet._id
                }
            }, (err) => {
                console.log("User Update Success");
            });
            req.flash('success', 'Withdraw request submitted successfully')
            res.redirect('/');
        }
    }
}