const authoModel= require('../Model/authorModel.js');

const createAuthor =async function(req,res){
    try{
        let {fname,lname,title,email,password}=req.body;
        console.log(fname,lname,title,email,password);
        if(!fname,!lname,!title,!email,!password) return res.send({msg:"All data are Mondatory"});
        const create =await authoModel.create({fname,lname,title,email,password});
        res.status(201).send({msg:create})

    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }

}

module.exports={createAuthor}
