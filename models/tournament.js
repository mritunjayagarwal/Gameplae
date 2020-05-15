const mongoose = require('mongoose');
const Schema = mongoose.Schema

const TournamentSchema = new Schema({
    game: { type: Schema.Types.ObjectId, ref: 'Game'},
    owner: { type: Schema.Types.ObjectId, ref: 'User'},
    name: String,
    participants: { type: Number, defualt: 0},
    players: [
        {
            user: { type: Schema.Types.ObjectId, ref: 'User'},
            joined: { type: Date, default: Date.now}
        }
    ],
    created: { type: Date, default: Date.now},
    starts: Date,
    ends: Date
});

module.exports = mongoose.model('Tournament', TournamentSchema);