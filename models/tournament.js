const mongoose = require('mongoose');
const Schema = mongoose.Schema

const TournamentSchema = new Schema({
    game: { type: Schema.Types.ObjectId, ref: 'Game'},
    owner: { type: Schema.Types.ObjectId, ref: 'User'},
    name: String,
    participants: { type: Number, defualt: 0},
    price: Number,
    desc: String,
    players: [
        {
            user: { type: Schema.Types.ObjectId, ref: 'User'},
            joined: { type: Date, default: Date.now},
            username: { type: String, required: true}
        }
    ],
    winners: [
        {
            user: { type: Schema.Types.ObjectId, ref: 'User'},
            name: String,
            processed: { type: Date, default: Date.now},
            username: { type: String, required: true, unique: true},
            position: Number,
            won: Number
        }
    ],
    created: { type: Date, default: Date.now},
    eclosing: Date,
    starts: Date,
    ends: Date
});

module.exports = mongoose.model('Tournament', TournamentSchema);