const authorModel= require('../Model/authorModel.js');
const jwt=require('jsonwebtoken')

const createAuthor =async function(req,res){
    try{
        let {fname,lname,title,email,password}=req.body;
        if(!fname,!lname,!title,!email,!password) return res.status(400).send({status:false, error:"All data are Mondatory"});
        
        if(!fname){
            return res.status(400).send({status:false,error:"First Name is required"})
        }else{
            if(!(/^([a-zA-Z_]+\s)*[a-zA-Z_]{2,30}$/).test(fname)) return res.status(400).send({status:false,error:"This firstname contains certain characters that aren't allowed"})
        }

        if(!lname) {
            return res.status(400).send({status:false,error:"Last Name is required"})
        }else{
            if(!(/^([a-zA-Z_]+\s)*[a-zA-Z_]{2,30}$/).test(lname)) return res.status(400).send({status:false,error:"This lastname contains certain characters that aren't allowed"})
        };
        if(!title) return res.status(400).send({status:false, error:"title is required"});
        if(!password){
             return res.status(400).send({status:false,error:"Password is required"});
            }else{
                let regex=/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/
                if(!regex.test(password)) return res.status(400).send({status:false,error:"Your password must be at least 8 characters long, contain at least one number and symbol and have a mixture of uppercase and lowercase letters."})
            }
        if(!email){ 
            return res.status(400).send({status:false,error:"Email is required"})
        }else{
            if (!(/^\w+([\.]?\w+)@\w+([\.]?\w+)(\.\w{2,3})+$/).test(email)) {
                return res.status(400).send({status:false, error:"please provide valid email"})
            }
        }
        const create =await authorModel.create({fname,lname,title,email,password});
        res.status(201).send({status:true, author:create})
    }
    catch (err) {
        res.status(500).send({ status:false, error:err.message })
    }

}

// ============================login========================================

const login = async function (req ,res){
    try{
        let {email,password} = req.body
        if(!email){
            return res.status(400).send({status:false, error:"please provide email"})
        }
        if(!password){
            return res.status(400).send({status:false, error:"please provide password"})
        }
        let author = await authorModel.findOne({email,password});
        if (!author) return res.status(400).send({status: false, error: "username or the password is not correct"});

          let token = jwt.sign({authorId: author._id.toString(),organisation: "LithiumGroup-18",},"grp-18-first-project");
          res.status(200).send({ status: true, data: token});
}
catch(error){
    return res.status(500).send({status:false, error:error.message})
}
};

module.exports={createAuthor,login}
