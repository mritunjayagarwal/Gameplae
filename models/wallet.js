const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WalletSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User'},
    upi: {
      name: String,
      holder: String,
      rnum: Number
    },
    bank: {
        hname: String,
        acnum: Number,
        bname: String,
        branch: String,
        ifsc: String,
    },
    history: [
        {
            amount: Number,
            name: String,
            number: Number,
            date: { type: Date, default: Date.Now},
            through: String,
            processing: { type: Boolean, default: 'true'}
        }
    ],
    pan: {
        pnum: String,
        hname: String
    },
    processing: { type: Boolean, default: false}
});

module.exports = mongoose.model('Wallet', WalletSchema);