const blogModel=require('../Model/blogModel')
const AuthorModel=require("../Model/authorModel")
let mongoose= require('mongoose')
const moment=require('moment')
const isValid=mongoose.Types.ObjectId.isValid


// ================================create blog=============================================
const createblog=async function(req,res){
    try{
    let data=req.body
    let authorId=data.authorId
    if(!authorId) return res.status(400).send({error:"authorId must be present"})
    if(!isValid(authorId)) return res.status(400).send({status:false,error:"authorId is not Valid"})

    if(!data.body){
        return res.status(400).send({status:false,error:"please provide body"})
    }else{
        let Body=data.body;
        let regex="[a-zA-Z0-9_]$"
        let result=Body.match(regex);
        if(!result) return res.status(400).send({status:false,error:"Please Provide Valid Body"})
    };


    if(!data.title){
        return res.status(400).send({status:false,error:"please provide title"})
    }else{
        let Title=data.title;
        let regex="[a-zA-Z0-9_]$"
        let result=Title.match(regex);
        if(!result) return res.status(400).send({status:false,error:"Title Must be gr"})
    };

    if(!data.category){
        return res.status(400).send({status:false,error:"please provide category"})
    }else{
        let Category=data.category;
        let regex="[a-zA-Z0-9_]$"
        let result=Category.match(regex);
        if(!result) return res.status(400).send({status:false,error:" Please provide Category"})
    };
    
    let findDetails = await AuthorModel.findById(authorId)
    if (!findDetails) return  res.status(404).send({ status: false, error: "this author details not exist" })
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
// ==============================put api==========================================

const updateBlogs = async function (req ,res){
    try{
        const blogId = req.params.blogId;
        if(!isValid(blogId)){
            return res.status(400).send({status:false, error: "bad request"})
        }
        const id = await blogModel.findById(blogId);
        if (id.isDeleted==true){
            return res.status(404).send({msg: "data not found"})
        }
        let data = req.body
        let { title, body, subcategory, tags} = data
        
        const blogUpdate = await blogModel.findOneAndUpdate({ _id: blogId }, {
            $set: { title, body, isPublished:true, publishedAt: new Date() },
            $push: { tags, subcategory }
        }, {  upsert: true,new: true })

        res.status(200).send({ status: true,message:"updated", data: blogUpdate })

        } catch(error){
            res.status(500).send({status:false, message: "error"})
        }
    
};

// =============================delete by param=================================
const deletedBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId
        if(!blogId) return res.status(400).send({error:"blogId must be present"})
        if(!isValid(blogId)) res.status(400).send({status:false,error:"blogId is not valid"})
    
        let blog = await blogModel.findById(blogId);
        if (!blog) {
          return res.status(404).send({status:false, error:"No such blog exists"});
        }
        if(blog.isDeleted){
            return res.status(404).send({status:false, message:"Already deleted"})
        }

        let blogData = req.body
        let deletedBlog = await blogModel.updateOne({ _id: blogId },{$set:{isDeleted:true,deletedAt:new Date()}}, blogData);
        res.status(200).send()
      }
    catch (error){
        res.status(500).send({status:false,error:error.message })
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
        let documents= await blogModel.find(data)
        if(documents.length==0){
           return res.status(404).send({status:false,error:"Please provide valid data"})
        }else{
            let deletedata=await blogModel.updateMany(data,{$set:{isDeleted:true,deletedAt:new Date()}})
            return res.status(200).send()
        }
    }
}
catch(error){
    res.status(500).send({status:false,error:error.message})
}
}
// =======================================================================================

module.exports.createblog=createblog
module.exports.getBlogs=getBlogs
module.exports.deletebyquery=deletebyquery
module.exports.deletedBlog=deletedBlog
module.exports.updateBlogs=updateBlogs