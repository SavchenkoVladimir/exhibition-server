// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('BuisnessCardData', new Schema({
    cardData: Schema.Types.Mixed,
    poleId: String,
    createdAt: { type : Date, default: Date.now }
}));