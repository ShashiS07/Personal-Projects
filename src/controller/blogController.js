const blogModel=require('../Model/blogModel')
const AuthorModel=require("../Model/authorModel")
let mongoose= require('mongoose')
const moment=require('moment')

const createblog=async function(req,res){
    try{
    let data=req.body
    let authorId=data.authorId
    if(!authorId) return res.status(400).send({error:"authorId must be present"})
    if(!mongoose.Types.ObjectId.isValid(authorId)) res.status(400).send({status:false})

    if(!data.body){return res.status(400).send({status:false,error:"please provide body"})}

    if(!data.title){return res.status(400).send({status:false,error:"please provide title"})}

    if(data.category=="" || data.category ==[]){return res.status(400).send({status:false,error:"please provide category"})}
    let findId = await AuthorModel.findById(authorId)
    if (!findId) return res.status(404).send({ status: false, error: "this authorId not exist" })
    let blog= await blogModel.create(data)
    if(data.isPublished==true){
     blog.publishedAt=moment().format()
    }
    if(data.isDeleted==true){
        blog.deletedAt=moment().format()
    }
    res.status(201).send({status:true,blog:blog})  
}
catch(error){
    res.status(500).send({status:false,error:error.message})
}
}



let getBlogs = async function (req,res){
    try{
        let authorId = req.query.authorId
        let category = req.query.category
        let tags = req.query.tags
        let subcategory = req.query.subcategory
        let query={authorId,category,tags,subcategory}
        if(query.authorId==undefined&&query.tags==undefined&&query.category==undefined&&query.subcategory==undefined){
            let blogDetails = await blogModel.find({isDeleted:false ,isPublished:true})
            if (!blogDetails){
               return  res.status (404).send({status: false , msg:"No blog exist" } )
                }else {
                    return res.status(200).send({status :true ,data : blogDetails})
                }
        }else{
            let getDetails = await blogModel.find({$or:[{authorId:authorId},{category :category},{tags:tags},{subcategory:subcategory}]})
            if (!getDetails){
            return res.status(400).send({status:false, msg:"Bad reuest" })
            }else{
            return res.status(200).send({statue:true , data : getDetails})
            }   
        }
    }
    catch(error) {
        res.status(500).send({msg : "error"})
    }
}

module.exports.createblog=createblog
module.exports.getBlogs=getBlogs