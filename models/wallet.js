const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WalletSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User'},
    holder: String,
    phone: Number,
    balance: { type: Number, default: 0},
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
            upi: String,
            hname: String,
            acnum: Number,
            bname: String,
            branch: String,
            ifsc: String,
            submitted: { type: Date, default: Date.now},
            through: String,
            processing: { type: Boolean, default: 'true'},
            processed: { type: Date}
        }
    ],
    pan: {
        pnum: String,
        hname: String
    },
    generated: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Wallet', WalletSchema);