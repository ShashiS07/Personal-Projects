const authoModel= require('../Model/authorModel.js');

const createAuthor =async function(req,res){
    try{
        let {fname,lname,title,email,password}=req.body;
        if(!fname) return res.send("FirstnName Is requries");
        if(!lname) return res.send("LastName is required");
        if(!title) return res.send("Title is requred");
        if(!password) return res.send("Password is required")
        if(!email){ 
            return res.send("Email is required")
        }else{
            let emailId=email;
            let regex="^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$";
            let result=emailId.match(regex);
            if(!result){
                return res.send("Email is not valid Format")
            }
        }
        if(!fname,!lname,!title,!email,!password) return res.send({msg:"All data are Mondatory"});
        const create =await authoModel.create({fname,lname,title,email,password});
        res.status(201).send({msg:create})
    }
    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }

}

module.exports={createAuthor}
