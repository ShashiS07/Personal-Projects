const jwt=require('jsonwebtoken')
const blogModel=require('../Model/blogModel')

const authentication=async function(req,res,next){
    try{
        let token=req.headers["x-api-key"]
        if(!token) return res.status(404).send({status:false,error:"Token must be present"})

        let decodedToken=jwt.verify(token,"grp-18-first-project")
        if(!decodedToken) return res.status(401).send({status:false,error:"Token is invalid"})
        req["decodedToken"]=decodedToken
        next()
    }
    catch(error){
        res.status(500).send({status:false,error:error.message})
    }
}

const authorization = function(req,res,next){
    try{
    let authorId = req.params.authorId  //header empty/filled check nhi  bcuz uper check hoke aa rha h

    let token = req.headers["x-api-key"]       //ek owner ka ek token , jiske ander uski id etc (token me payload, payload me id, password)
    let decode = jwt.verify(token, "grp-18-first-project")   //to token me present payload and secrate ki help se wapis token to bnayega , and check karega ki dono token same bn rhe h ki nhi, then
    let authorLogin = decode.authorId    //token me se ,is token ke owner ki id hogi, usko nikale

    if(authorId != authorLogin) return res.status(400).send({status:"false",msg: "unauthorized user" })            //authorId (already loggined user) means abhi jo access krna chah rha h, and 1st time login me jo banda tha dono same h ki nhi , if same h to put delete krne do warna error
    next()
    }
    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }
}
module.exports.authentication=authentication
module.exports.authorization=authorization