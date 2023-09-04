const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({

  text: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  likes:{type : Array, default : []},


} , {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  });


const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
