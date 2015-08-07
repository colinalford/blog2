var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    blog_id: String,
    user: {
        user_id: String,
        username: String
    },
    body: String,
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Comments', CommentSchema);
