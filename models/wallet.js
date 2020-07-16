const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WalletSchema = new Schema({
    owner: { type: String, unique: true, uppercase: true},
    upi: {
      name: String,
      rnum: Number
    },
    bank: {
        hname: String,
        acnum: Number,
        bname: String,
        branch: String,
        ifsc: String,
    },
    pan: {
        pnum: String,
        hname: String
    }
});

module.exports = mongoose.model('Wallet', WalletSchema);