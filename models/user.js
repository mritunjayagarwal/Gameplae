const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
    name: { type: String, required: true, lowercase: true},
    email: { type: String, unique: true},
    password: { type: String, required: true},
    phone: { type: Number, required: true},
    verified: { type: Boolean, default: false},
    tournament: [{
        tour: { type: Schema.Types.ObjectId, ref: 'Tournament'},
        joined: { type: Date, default: Date.now}   
    }],
    joined: { type: Date, default: Date.Now},
    pay: { type: Schema.Types.ObjectId, ref: 'Wallet'},
    lastlogin: { type: Date, default: Date.now}
});

userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

userSchema.methods.compare = function(password){
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);