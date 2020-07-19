module.exports = function(Wallet, User, async){
    return {
        SetRouting: function(router){
            router.post('/wrsubmit', this.wrSubmit);
        },
        wrSubmit: function(req, res){
           Wallet.findOne({ owner: req.user._id}, ( err, wallet) => {
               if(wallet){
                   Wallet.update({
                       owner: req.user._id
                   }, {
                       $set: {
                           upi: {
                            name: req.body.payThrough,
                            holder: req.body.holdername,
                            rnum: req.body.upiNum
                           }
                       }
                   }, (err) => {
                       req.flash('success', "Wallet Update Success");
                       res.redirect('/');
                   })
               }

               if(err){
                   req.flash("error", "An error occured while processing your request");
                   res.redirect('/')
               }

               if(!wallet){
                const newWallet = new Wallet();
                newWallet.owner = req.user._id;
                newWallet.upi.name = req.body.payThrough;
                newWallet.upi.holder = req.body.holdername
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
           })
        }
    }
}