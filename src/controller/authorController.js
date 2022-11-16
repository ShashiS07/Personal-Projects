const authorModel= require('../Model/authorModel.js');
const jwt=require('jsonwebtoken')

const createAuthor =async function(req,res){
    try{
        let {fname,lname,title,email,password}=req.body;
        if(!fname,!lname,!title,!email,!password) return res.status(400).send({status:false, error:"All data are Mondatory"});
        
        if(!fname){
            return res.status(400).send({status:false,error:"First Name is required"})
        }else{
            let firstname=fname;
            let regex="[a-zA-Z_]{2,20}$"
            let result=firstname.match(regex);
            if(!result) return res.status(400).send({status:false,error:"firstname is not valid"})
        }

        if(!lname) {
            return res.status(400).send({status:false,error:"Last Name is required"})
        }else{
            let lastname=lname;
            let regex="[a-zA-Z_]{2,20}$"
            let result=lastname.match(regex);
            if(!result) return res.status(400).send({status:false,error:"Lastname is not valid"})
        };
        if(!title) return res.status(400).send({status:false,error:"title is required"});
        if(!password){
             return res.status(400).send({status:false,error:"Password is required"});
            }else{
                let Password=password;
                let regex="[a-zA-Z0-9_]{5,20}$"
                let result=Password.match(regex);
                if(!result) return res.status(400).send({status:false,error:"Password is not valid"})
            };
        if(!email){ 
            return res.status(400).send({status:false,error:"Email is required"})
        }else{
            let emailId=email;
            let regex="^[a-zA-Z0-9+.-]+@[a-zA-Z0-9.-]+.[a-zA-Z0-9+.-]+$";
            let result=emailId.match(regex);
            if(!result){
                return res.status(400).send({status:false,error:"Email is not valid Format"})
            }
        }
        const create =await authorModel.create({fname,lname,title,email,password});
        res.status(201).send({msg:create})
    }
    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }

}

// ============================login========================================

const login = async function (req ,res){
    try{
        let {email,password} = req.body
        let author = await authorModel.findOne({email,password});
        if (!author)
          return res.send({
            status: false,
            msg: "username or the password is not corerct",
          });
    
          let token = jwt.sign({authorId: author._id.toString(),organisation: "LithiumGroup-18",},"grp-18-first-project");
          res.setHeader("x-api-key", token);
          res.send({ status: true, data: token });
}
catch(error){
    return res.status(500).send({status:false, error:error.message})
}
};


module.exports={createAuthor,login}
