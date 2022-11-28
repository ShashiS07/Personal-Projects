const bookModel=require('../model/bookModel')

// ==============================create books===========================================

const createBook = async function(req, res){
    try{
        let reqBody = req.body
        const {title, excerpt, userId, ISBN, category, subCategory, releasedAt } = reqBody

        if(!reqBody) return res.status(400).send({status: false , msg: "Book data is required"})
        if(!title) return res.status(400).send({status: false , msg: "Title is required"})
        if(!excerpt) return res.status(400).send({status: false, msg: "Excerpt is required"})
        if(!userId) return res.status(400).send({status: false, msg: "User ID is required"})
        if(!ISBN) return res.status(400).send({status: false, msg: "ISBN is required"})
        if(!category) return res.status(400).send({status: false, msg: "category is required"})
        if(!subCategory) return res.status(400).send({status: false, msg: "Sub category is required"})
        if(!releasedAt) return res.status(400).send({status: false, msg: "Book release date is required"})

        const bookData = await bookModel.create(reqBody)

        return res.status(201).send({status: true , data: bookData})


    }
    catch (err){
        return res.status(500).send({error: err.message})
    }
}

// =============================get books================================================

const getbooks= async function(req,res){
    try{
        let data=req.query
        let filterbook={isDeleted:false,...data}
        if(!Object.keys(data).length){
            let books = await bookModel.find({isDeleted:false}).sort({title:1})
            if(!Object.keys(books).length){
                return res.status(404).send({status:false, message:"No book exist"})
            }
            return res.status(200).send({status:true, message:"Book List", data:books})
        }else{
            let books= await bookModel.find(filterbook).select({_id:1,title:1,excerpt:1,userId:1,category:1,reviews:1,releasedAt:1}).sort({title:1})
            if(!Object.keys(books).length){
                return res.status(404).send({status:false,message:"No such book exist"})
            }
            return res.status(200).send({status:true, message:"Book List",data:books})
        }
    }catch(error){
        return res.status(500).send({status:false, message:error.message})
    }
    }

module.exports={getbooks , createBook}