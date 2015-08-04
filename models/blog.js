var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema({
    title: String,
    body: String,
    author: { type: String, default: 'Colin Alford'},
    comments: [{ author: String, body: String, date: Date }],
    created_at: { type: Date, default: Date.now },
    isHidden: { type: Boolean, default: false }
});

module.exports = mongoose.model('Blog', blogSchema);
