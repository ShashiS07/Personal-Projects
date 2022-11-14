const blogModel=require('../Model/blogModel')
const AuthorModel=require("../Model/authorModel")
let mongoose= require('mongoose')

const createblog=async function(req,res){
    try{
    let data=req.body
    let authorId=data.authorId
    if(!authorId) return res.status(400).send({error:"authorId must be present"})
    if(!mongoose.Types.ObjectId.isValid(authorId)) res.status(400).send({status:false})
        let findId = await AuthorModel.findById(authorId)
        if (!findId) return res.status(404).send({ status: false, msg: "this authorId not exist" })
        let blog= await blogModel.create(data)
        res.status(201).send({status:true,blog:blog})  
}
catch(error){
    res.status(500).send({status:false})
}
}

module.exports.createblog=createblog