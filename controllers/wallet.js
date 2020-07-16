module.exports = function(Wallet, User, async){
    return {
        SetRouting: function(router){
            router.post('/wrsubmit', this.wrSubmit);
        },
        wrSubmit: function(req, res){
            
        }
    }
}