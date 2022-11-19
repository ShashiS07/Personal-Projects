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
            return res.status(400).send({status:false, error:"Please Provide Data to Update"})
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
    };
    
    let findDetails = await AuthorModel.findById(authorId)
    if (!findDetails) return  res.status(404).send({ status: false, error: "this author details not exist" })
    let blog= await blogModel.create(data)
    if(data.isPublished){
     blog.publishedAt=moment().format()
    }
    if(data.isDeleted){
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
               return  res.status (404).send({status: false , error:"No blog exist" } )
                }else {
                    return res.status(200).send({status :true ,data : blogDetails})
                }
        }else{
            let filterdata={isDeleted:false, authorId:req.authorId}
            let {category,subcategory,tags,isPublished,authorId}=req.query

        if(authorId){
            if(!isValid(authorId)){
            return res.status(400).send({status:false, error:"Please provide valid id"})
         }else
            filterdata.authorId=authorId
        }
            if(category)  filterdata.category=category
            if(subcategory) filterdata.subcategory=subcategory
            if(tags) filterdata.tags=tags
            if(isPublished) filterdata.isPublished=isPublished
   
            let getDetails = await blogModel.find(filterdata).populate('authorId')
            
            if (getDetails.length==0){
            return res.status(400).send({status:false, error:"Bad reuest" })
            }else{
            return res.status(200).send({statue:true , data : getDetails})
            }   
        }
    }
    catch(error) {
        res.status(500).send({status:false, error:error.message})
    }
}
// ==============================put api==========================================

const updateBlogs = async function (req ,res){
    try{
        const blogId = req.params.blogId;
        if(!isValid(blogId)){
            return res.status(400).send({status:false, error: "Bad Request"})
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
            return res.status(404).send({status:false, message:"Already deleted"})
        }

        let deletedBlog = await blogModel.updateOne({ _id: blogId },{$set:{isDeleted:true,deletedAt:new Date()}});
        res.status(200).send()
      }
    catch (error){
        res.status(500).send({status:false,error:error.message })
    }
}

// ============================delete by query=====================================

const deletebyquery=async function(req,res){
try{
   let filterdata={isDeleted:false, authorId:req.authorId}
   let {category,subcategory,tags,isPublished,authorId}=req.query

   if(authorId){
    if(!isValid(authorId)){
        return res.status(400).send({status:false, error:"Please provide valid id"})
    }else
    filterdata.authorId=authorId
   }
   if(category){
    filterdata.category=category
   }
   if(subcategory){
    filterdata.subcategory=subcategory
   }
   if(tags){
    filterdata.tags=tags
   }
   if(isPublished){
    filterdata.isPublished=isPublished
   }
   let data=await blogModel.findOne(filterdata)

   if(!data){
     return res.status(404).send({status:false, error:"Id is not valid"})
   }

   if(!data){
    return res.status(404).send({status:false, error:"data is not found"})
  }

  if(data.isDeleted == true){
    return res.status(400).send({status: false, message: "Already Deleted" })
  }

  if(data.authorId._id.toString() !== req["decodedToken"].authorId.toString()){
    return res.status(401).send({status:false,error : "not authorised"})
  }
  let updatedData = await blogModel.updateOne(filterdata, {isDeleted : true},{new:true})
  return res.status(200).send({status:true, message : " messege is deleted" })
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