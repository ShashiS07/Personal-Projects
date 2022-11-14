const mongoose=require('mongoose')

const AuthorSchema=new mongoose.Schema({
    firstName:{
        type: String,
        requried: true
    },
    lastName:{
        type: String,
        required:true
    },
    title:{
        required: true,
        enum:["Mr", "Mrs", "Miss"]
    },
    email:{
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true})

module.exports=mongoose.model("Author", AuthorSchema)