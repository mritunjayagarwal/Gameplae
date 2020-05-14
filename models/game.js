const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
    name: { type: String, unique: true},
    pname: { type: String, unique: true},
    description: String,
    cover: { type: String, default: 'cover.jpg'},
    face: { type: String, default: 'face.png'},
    tournaments: [{ type: Schema.Types.ObjectId, ref: 'Tournament'}]
});

module.exports = mongoose.model('Game', GameSchema);