const blogModel=require('../Model/blogModel')
const AuthorModel=require("../Model/authorModel")
let mongoose= require('mongoose')
const moment=require('moment')
const isValid=mongoose.Types.ObjectId.isValid

const createblog=async function(req,res){
    try{
    let data=req.body
    let authorId=data.authorId
    if(!authorId) return res.status(400).send({error:"authorId must be present"})
    if(!isValid(authorId)) return res.status(400).send({status:false,error:"authorId is not Valid"})

    if(!data.body){return res.status(400).send({status:false,error:"please provide body"})}

    if(!data.title){return res.status(400).send({status:false,error:"please provide title"})}

    if(data.category==" " || data.category ==[]){return res.status(400).send({status:false,error:"please provide category"})}
    let findId = await AuthorModel.findById(authorId)
    if (!findId) return  res.status(404).send({ status: false, error: "this authorId not exist" })
    let blog= await blogModel.create(data)
    if(data.isPublished==true){
     blog.publishedAt=moment().format()
    }
    if(data.isDeleted==true){
        blog.deletedAt=moment().format()
    }
    return res.status(201).send({status:true,blog:blog})  
}
catch(error){
    res.status(500).send({status:false,error:error.message})
}
}

// =========================get blog details=======================================

let getBlogs = async function (req,res){
    try{
        let {authorId,category,tags,subcategory} = req.query
        if(authorId==undefined&&tags==undefined&&category==undefined&&subcategory==undefined){
            let blogDetails = await blogModel.find({isDeleted:false ,isPublished:true}).populate('authorId')
            if (!blogDetails){
               return  res.status (404).send({status: false , msg:"No blog exist" } )
                }else {
                    return res.status(200).send({status :true ,data : blogDetails})
                }
        }else{
            let getDetails = await blogModel.find({$or:[{authorId:authorId},{category :category},{tags:tags},{subcategory:subcategory}]}).populate('authorId')
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

// ============================delete by query=====================================

const deletebyquery=async function(req,res){
try{
    let data=req.query
    if(Object.values(data).length==0){
      return res.status(404).send({status:false,error:"Bad request"})
    }
    if(data){
        let find= await blogModel.find(data)
        if(find.length==0){
            res.status(404).send({status:false,error:"Data is not exist"})
        }else{
            let deletedata=await blogModel.updateMany(data,{$set:{isDeleted:true,deletedAt:new Date()}})
            return res.status(200).send({status:true,msg:deletedata})
        }
    }
}
catch(error){
    res.status(500).send({status:false,error:error.message})
}
}

module.exports.createblog=createblog
module.exports.getBlogs=getBlogs
module.exports.deletebyquery=deletebyquery