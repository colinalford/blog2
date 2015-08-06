var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BlogSchema = new Schema({
    title: String,
    body: String,
    author: { type: String, default: 'Colin Alford'},
    created_at: { type: Date, default: Date.now },
    isHidden: { type: Boolean, default: false }
});

module.exports = mongoose.model('Blog', BlogSchema);
