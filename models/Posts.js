const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
userId : {
    type : String,
    required : true
},
post : {
    type : String,
    min: 3,
    max:750
},
Image : {
    type : String
},
likes : {
    type : Array,
    default : []
},
comments : {
    type : Array,
    default : []
},
hashtags: {
    type : Array,
    default : []
}

})

const Post = mongoose.model('Post', PostSchema);
module.exports =  Post   ;

