const blogModel=require('../Model/blogModel')
const AuthorModel=require("../Model/authorModel")
let mongoose= require('mongoose')
const moment=require('moment')
const isValid=mongoose.Types.ObjectId.isValid


// ================================create blog=============================================
const createblog=async function(req,res){
    try{
    let data=req.body
        if(Object.values(data).length==0){
            return res.status(400).send({status:false, error:"Please Provide Data"})
        }
    let authorId=data.authorId
    if(!authorId) return res.status(400).send({error:"authorId must be present"})
    if(!isValid(authorId)) return res.status(400).send({status:false,error:"authorId is not Valid"})

    if(!data.body){
        return res.status(400).send({status:false,error:"please provide body"})
    }else{
        let Body=data.body;
        if(!/([a-zA-Z0-9!.?,-_]$)/.test(Body)) return res.status(400).send({status:false,error:"Please Provide Valid Body"})
    };

    if(!data.title){
        return res.status(400).send({status:false,error:"please provide title"})
    }else{
        let Title=data.title;
        if(!/([a-zA-Z0-9_]$)/.test(Title)) return res.status(400).send({status:false,error:"Title Must be given"})
    };

    if(!data.category){
        return res.status(400).send({status:false,error:"please provide category"})
    }else{
        let Category=data.category;
        if(!/([a-zA-Z0-9_]$)/.test(Category)) return res.status(400).send({status:false,error:" Please provide Category"})
    }

    let findDetails = await AuthorModel.findById(authorId)
    if (!findDetails) return  res.status(404).send({ status: false, error: "this author details not exist" })
    let blog= await blogModel.create(data)
    if(data.isPublished){
     blog.publishedAt=moment().format()
    }
    if(data.isDeleted){
        blog.deletedAt=moment().format()
    }
    return res.status(201).send({status:true,data:blog})  
}
catch(error){
    res.status(500).send({status:false,error:error.message})
}
}

// =========================get blog details=======================================

let getBlogs = async function (req,res){
    try{
        let data=req.query
        if(!Object.keys(data).length){
            if(!data.authorId || !data.category || !data.tags || !data.subcategory){
                let blogDetails = await blogModel.find({isDeleted:false ,isPublished:true}).populate('authorId')
            if (!blogDetails){
               return  res.status (404).send({status: false , error:"No blog exist" } )
                }else {
                    return res.status(200).send({status :true ,data : blogDetails})
                }
            }
        }else{
            if(data.authorId || data.category || data.tags || data.subcategory){
                let filterdata={isDeleted:false}
                if(data.authorId){
                    if(!isValid(data.authorId)){
                    return res.status(400).send({status:false, error:"Please provide valid id"})
                 }else
                    filterdata.authorId=data.authorId
                }
            if(data.category)  filterdata.category=data.category
            if(data.subcategory) filterdata.subcategory=data.subcategory
            if(data.tags) filterdata.tags=data.tags
            if(data.isPublished) filterdata.isPublished=data.isPublished
            let getDetails = await blogModel.find(filterdata).populate('authorId')
            
            if (getDetails.length==0){
            return res.status(400).send({status:false, error:"No blog found with this query"})
            }else{
            return res.status(200).send({statue:true , data : getDetails})
            } 
        }
        return res.status(400).send({status:false,message:"Please Provide valid query (tags/authodId/category/subcategory)"})
    }
}catch(error) {
        res.status(500).send({status:false, error:error.message})
    }
}
// ==============================put api==========================================

const updateBlogs = async function (req ,res){
    try{
        const blogId = req.params.blogId;
        if(!isValid(blogId)){
            return res.status(400).send({status:false, error: "Please Provide valid Id"})
        }
        const id = await blogModel.findById(blogId);
        if (id.isDeleted==true){
            return res.status(404).send({status:false, error: "Document is deleted"})
        }
        let data = req.body
        if(Object.values(data).length==0){
            return res.status(400).send({status:false, error:"Please Provide Data to Update"})
        }
        let { title, body, subcategory, tags} = data
        
        const blogUpdate = await blogModel.findOneAndUpdate({ _id: blogId }, {
            $set: { title, body, isPublished:true, publishedAt: new Date() },
            $push: { tags, subcategory }
        }, {  upsert: true,new: true })

        res.status(200).send({ status: true,message:"updated", data: blogUpdate })

        } catch(error){
            res.status(500).send({status:false, error:error.message})
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
            return res.status(200).send({status:false, message:"Already deleted"})
        }

        let deletedBlog = await blogModel.updateOne({ _id: blogId },{$set:{isDeleted:true,deletedAt:new Date()}});
        res.status(200).send({status:true,message:"Blog is deleted"})
      }
    catch (error){
        res.status(500).send({status:false,error:error.message })
    }
}

// ============================delete by query=====================================

const deletebyquery=async function(req,res){
try{
  let data=req.query
  if(!Object.keys(data).length) return res.status(400).send({status:false,message:"Please Provide Query"})

  let checkId = await blogModel.find(data).select({_id:0,authorId:1})
  if(checkId.length==0) return res.status(400).send({status:false,message:"No Blog found"})

  let count=0
  for(let i=0;i<checkId.length;i++){
    if((checkId[i].authorId).toString()==req["decodedToken"].authorId) count++
  }
  if(count==0) return res.status(403).send({status:false,message:"Not Authorised"})

  const blogs = await blogModel.updateMany({$and:[{isDeleted:false,authorId:req["decodedToken"].authorId},req.query]},{isDeleted:true,deletedAt:new Date(Date.now())}, {new: true});

  if(blogs.modifiedCount>0){ 
    return res.status(200).send({status:true,message:"Blog Deleted Successfully"})
}else{
    return res.status(200).send({status:true})
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