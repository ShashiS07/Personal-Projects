const jwt=require('jsonwebtoken')
const blogModel=require('../Model/blogModel')
let mongoose= require('mongoose')
const isValid=mongoose.Types.ObjectId.isValid

const authentication=async function(req,res,next){
    try{
        let token=req.headers["x-api-key"]
        if(!token) return res.status(404).send({status:false,error:"Token must be present"})
        jwt.verify(token,"grp-18-first-project",function(error,decodedToken){
            if(error){
                res.status(400).send({status:false,message:"Invalid Token"})
            }else{
                req["decodedToken"]=decodedToken
                next()
            }
        })  
    }
    catch(error){
        return res.status(500).send({status:false, error:error.message})
    }
}

const authorization= async function(req,res,next){
    try{
       decodedToken=req["decodedToken"]
        let blogId = req.params.blogId;
        if(!blogId) return res.status(400).send({status:false,error:"Blog Id must be present"})
        if(!isValid(blogId)) return res.status(400).send({status:false, error:"Id is not Valid"})
        let blogDetails=await blogModel.findById({_id:blogId})
        if(!blogDetails){
            return res.status(404).send({status:false, error:"Not Found"})
        }
        let authorId=blogDetails.authorId.toString()
      
        let userloggedin=decodedToken.authorId
        if(authorId!==userloggedin) return res.status(403).send({status:false,error:"User not authorised"})  
        next()
    }
    catch (error) {
    res.status(500).send({status:false,error:error.message})
    }
}


module.exports.authentication=authentication
module.exports.authorization=authorization
