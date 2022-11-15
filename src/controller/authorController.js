const authoModel= require('../Model/authorModel.js');

const createAuthor =async function(req,res){
    try{
        let {fname,lname,title,email,password}=req.body;
        if(!fname,!lname,!title,!email,!password) return res.status(400).send({status:false, error:"All data are Mondatory"});
        if(!fname) return res.status(400).send({status:false,error:"First Name is required"});
        if(!lname) return res.status(400).send({status:false,error:"Last Name is required"});
        if(!title) return res.status(400).send({status:false,error:"title is required"});
        if(!password) return res.status(400).send({status:false,error:"Password is required"})
        if(!email){ 
            return res.status(400).send({status:false,error:"Email is required"})
        }else{
            let emailId=email;
            let regex="^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+.[a-zA-Z0-9+_.-]+$";
            let result=emailId.match(regex);
            if(!result){
                return res.status(400).send({status:false,error:"Email is not valid Format"})
            }
        }
        const create =await authoModel.create({fname,lname,title,email,password});
        res.status(201).send({msg:create})
    }
    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }

}

module.exports={createAuthor}
