const userModel= require("../model/userModel")
const Jwt = require('jsonwebtoken')
const { checkInputsPresent, checkString, validatePincode, validateName, validateEmail, validatePassword, validateTitle, validateMobileNo } = require('../validator/validator')


const createUser= async function(req,res){
    try{

        let data = req.body;

        let { title, name, phone, email, password, address} = data

        if (!checkInputsPresent(data)) return res.status(400).send({ status: false, message: "Request Can't Be Empty." });
        // if (checkInputsPresent(rest)) { return res.status(400).send({ status: false, message: "You can't input anything except title, name, phone, email, password and address." }) }

        if (!checkString(title)) return res.status(400).send({ status: false, message: "Please Provide Title." })
        if (!validateTitle(title)) return res.status(400).send({ status: false, message: "Invalid Title! Please input title as 'Mr' or 'Mrs' or 'Miss'." });

   
        if (!checkString(name)) return res.status(400).send({ status: false, message: "Please Provide Name." })
        if (!validateName(name)) return res.status(400).send({ status: false, message: "Invalid Name Provided" });

        if (!checkString(phone)) return res.status(400).send({ status: false, message: "Please Provide Phone Number." })
        if (!validateMobileNo(phone)) return res.status(400).send({ status: false, message: "Invalid Phone Number Provided." });

        let checkPhonePresent = await userModel.findOne({ phone: phone })
        if (checkPhonePresent) return res.status(400).send({ status: false, message: `This ${phone} is already registered! Please Use Different Phone Number.` })

        
        if (!checkString(email)) return res.status(400).send({ status: false, message: "Please Provide EmailID." })
        if (!validateEmail(email)) return res.status(400).send({ status: false, message: "Invalid EmailID Format or Please input all letters in lowercase." });

        let checkEmailPresent = await userModel.findOne({ email: email })
        if (checkEmailPresent) return res.status(400).send({ status: false, message: `This ${email} is already registered! Please Use Different EmailId for Registration.` });

        if (!checkString(password)) return res.status(400).send({ status: false, message: "Please Provide Password." })
        if (!validatePassword(password)) return res.status(400).send({ status: false, message: "Invalid Password Format! Password Should be 8 to 15 Characters and have a mixture of uppercase and lowercase letters and contain one symbol and then at least one Number." });
        
        if(!address) return res.status(400).send({status:false,message:"Please Provide address"})
        if(address){
            if(!Object.keys(address).length) return res.status(400).send({status:false,message:"Please provide Street/city/pincode"})
            if(!address.street || address.street=="") return res.status(400).send({status:false,message:"Please provide Street"})
            if(!address.city || address.city=="") return res.status(400).send({status:false,message:"Please provide city"})
            if(!address.pincode || address.pincode=="") return res.status(400).send({status:false,message:"Please provide pincode"})
        }
//         if(!(address)) return res.status(400).send({ status: false, message: "Please Provide address." })

// if(!(address.street)) return res.status(400).send({ status: false, message: "Please Provide street." })

        // if (data.hasOwnProperty('address')) {

        //     if (typeof address !== "object") return res.status(400).send({ status: false, message: "Address is Invalid type, should be an object" });
        //     if (!checkInputsPresent(address)) return res.status(400).send({ status: false, message: "Address must have atleast one field between (street, city, pincode)" });

        //     let { street, city, pincode, ...rest } = address
   
            
           
        //     if (address.hasOwnProperty('street')) {
        //         if (!checkString(street)) return res.status(400).send({ status: false, msg: `Invalid street (${street}) address Provided.` });
        //     }
           

        //     if (address.hasOwnProperty('city')) {
        //         if (!validateName(city)) return res.status(400).send({ status: false, msg: `Invalid City (${city}) address Provided.` });
        //     }
            
        //     if (address.hasOwnProperty('pincode')) {
        //         if (!validatePincode(pincode)) return res.status(400).send({ status: false, msg: `Invalid Pincode (${pincode}) Provided, provide valid Pincode with 6 Digit Numbers.` });
        //     }
        //     if (checkInputsPresent(rest)) { return res.status(400).send({ status: false, message: "You can't input anything in address except street, city and pincode." }) }
        // }




    let obj = await userModel.create(data)
    res.status(201).send({status:true,data:obj})
    }
    catch(err){
        res.status(500).send({status:false,message:err.message})
    }
}



const login = async function(req,res){
    try{
        let data1 = req.body;
        let { email, password, ...rest } = data1

        if (!checkInputsPresent(data1)) return res.status(400).send({ status: false, message: "You have to enter email and password." });
        if (checkInputsPresent(rest)) { return res.status(400).send({ status: false, message: "You can enter only email and password." }) }

        if (!checkString(email)) return res.status(400).send({ status: false, message: "EmailId required to login" })
        if (!validateEmail(email)) { return res.status(400).send({ status: false, message: "Invalid EmailID Format or Please input all letters in lowercase." }) }

        if (!checkString(password)) return res.status(400).send({ status: false, message: "Password required to login" })
        if (!validatePassword(password)) { return res.status(400).send({ status: false, message: "Re-enter your Correct Password." }) }

    let data2 = await userModel.findOne({email:email,password:password})
    if (!data2) { return res.status(401).send({ status: false, message: "Invalid Login Credentials! You need to register first." }) }

    let token = Jwt.sign({ userId: data1['_id']}, "SubodhPal@123", { expiresIn:"1d" })

    let obj = { userId: data1['_id'], token: token }

    res.status(200).send({ status: true, message: "Token Created Sucessfully", data: obj })
    }
    catch(err)
    {
        res.status(500).send({ status: 'error', error: err.message })
    }

}


module.exports={createUser,login} 