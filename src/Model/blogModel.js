const mongoose = require ("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema({

    title :{
        type : String,
        require : true
    },
    body : {
        type : String,
        require : true
    },
    authorId : {
        type : ObjectId,
        ref : "Author",
        require : true
    },
    tags : [String],
    category : {
        type : [String],
        require : true
    },
    subcategory : [String],
  
    deletedAt : {
        type : Date
    },
    isDeleted : {
        type : Boolean,
        default : false
    },
    isPublished : {
        type : Boolean,
        default : false
    },
    publishedAt : {
        type : Date
    },
},{timestamps : true});

module.exports = mongoose.model('Blog' ,blogSchema)