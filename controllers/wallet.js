module.exports = function(Wallet, User, async){
    return {
        SetRouting: function(router){
            router.post('/wrsubmit', this.wrSubmit);
            router.post('/rwsubmit', this.rwSubmit);
        },
        wrSubmit: async function(req, res){
            var user = await User.findOne({ _id: req.user._id}).exec();
            if(req.body.wammount > user.wallet){
                req.flash("error", "Sorry! You can not withdraw more than ₹" + user.wallet);
                res.redirect('/');
            }else{
                Wallet.findOne({ owner: req.user._id}, ( err, wallet) => {
                    if(wallet){
                        Wallet.updateOne({
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
        },
        rwSubmit: async function(req, res){
            var user = await User.findOne({ _id: req.user._id}).exec();
            if(req.body.rwammount > user.wallet){
                req.flash("error", "Sorry! You can not withdraw more than ₹" + user.wallet);
                res.redirect('/');
            }else{
                Wallet.findOne({ owner: req.user._id, 'upi.rnum': req.body.rUpiNum}, (err, wallet) => {
                    if(wallet){
                        var name = wallet.upi.holder;
                        Wallet.updateOne({
                            owner: req.user._id, 
                            'upi.rnum': req.body.rUpiNum
                        }, {
                            $push: {
                                history: { 
                                    amount: req.body.rwammount,
                                    through: 'UPI',
                                    number: req.body.rUpiNum,
                                    name: name
                                }
                            }, $set: {
                                processing: true
                            }
                        }, (err) => {
                            if(err){
                                req.flash("error", "Something went wrong..please try again later");
                                res.redirect('/')
                            }else{
                                console.log("Success");
                                res.redirect('/');
                            }
                        })
                    }else{
                        req.flash("error", "Sorry! We could not find any wallet registered to you");
                        res.redirect('/');
                    }
                })
            }
        }
    }
}