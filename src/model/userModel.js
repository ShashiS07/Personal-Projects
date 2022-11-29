const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({

    title:{type:String,require:true,enum:["Mr","Mrs","Miss"]},
    name:{type:String,require:true},
    phone:{type:String,require:true,unique:true},
    email:{type:String,require:true,unique:true},
    password:{type:String,require:true},
    address:{street:String,city:String,pincode:String}

},{timestamps:true})

module.exports=mongoose.model('user',userSchema)


