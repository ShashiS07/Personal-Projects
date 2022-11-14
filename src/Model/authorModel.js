const mongoose = require('mongoose')

const AuthorSchema=new mongoose.Schema( {
    fname:{
        type: String,
        requried: true
    },
    lname:{
        type: String,
        required:true
    },
    title:{
        type:String,
        enum:["Mr", "Mrs", "Miss"],
        required: true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true})

module.exports=mongoose.model("Author", AuthorSchema)