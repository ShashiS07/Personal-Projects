const bookModel=require('../model/bookModel')
const reviewModel= require('../model/reviewModel')
const { checkInputsPresent, checkString, validateName, validateTName, validateISBN, validateDate } = require('../Validator/validator')
const validator=require("../validator/validator")
const{isValidObjectId}=require("mongoose")


// ==============================create books===========================================

const createBook = async function(req, res){
    try {
        let data = req.body
        let { title, excerpt, userId, ISBN, category, subcategory,releasedAt} = data

        if (!checkInputsPresent(data)) return res.status(400).send({ status: false, message: "No data found from body!" })

        if (!checkString(userId)) { return res.status(400).send({ status: false, message: "Please Insert userId." }) }
        if (!ObjectId.isValid(userId)) { return res.status(400).send({ status: false, message: `This UserId: ${userId} is not Valid.` }) }
        
        let checkUserId = await userModel.findById(userId)
        if (!checkUserId) { return res.status(400).send({ status: false, message: `${userId} is not Exist.` }) }

        if (!checkString(title)) return res.status(400).send({ status: false, message: "Please Provide Title of Book." })
        if (!validateTName(title)) return res.status(400).send({ status: false, message: "Invalid Title." });

        if (!checkString(excerpt)) return res.status(400).send({ status: false, message: "Please Provide Book Excerpt." })
        if (!validateName(excerpt)) return res.status(400).send({ status: false, message: "Invalid Excerpt." });

        if (!checkString(ISBN)) return res.status(400).send({ status: false, message: "Please Provide Book ISBN." })
        if (!validateISBN(ISBN)) return res.status(400).send({ status: false, message: "Invalid ISBN." });

        if (!checkString(category)) return res.status(400).send({ status: false, message: "Please Provide Book Category." })
        if (!validateName(category)) return res.status(400).send({ status: false, message: "Invalid Category." });

        if (!checkString(subcategory)) return res.status(400).send({ status: false, message: "Please Provide Book Subcategory." })
        if (!validateName(subcategory)) return res.status(400).send({ status: false, message: "Invalid Subcategory." });

        if (!checkString(releasedAt)) return res.status(400).send({ status: false, message: "Please Provide Book releasedAt Date." });
        if (!validateDate(releasedAt)) return res.status(400).send({ status: false, message: "Invalid Date Format. You should use this format (YYYY-MM-DD)" });

        let checkDuplicateTitle = await bookModel.findOne({ title: title })
        if (checkDuplicateTitle) {
            return res.status(400).send({ status: false, message: `This Book: ${title} is already exist. Please provide another Title.` })
        }

        let checkDuplicateISBN = await bookModel.findOne({ ISBN: ISBN })
        if (checkDuplicateISBN) {
            return res.status(400).send({ status: false, message: `This ISBN: ${ISBN} is already exist. Please provide another ISBN.` })
        }

        let createBook = await bookModel.create(data)

        res.status(201).send({ status: true, message: `This ${title} Book is created sucessfully.`, data: createBook })

    } catch (error) {

        res.status(500).send({ status: 'error', error: error.message })
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
            if(data.userId||data.category||data.subcategory){
                if(data.userId){
                if(!isValidObjectId(data.userId)) return res.status(400).send({status:false,message:"Please provide valid userId"})
                }
                let books= await bookModel.find(filterbook).select({_id:1,title:1,excerpt:1,userId:1,category:1,reviews:1,releasedAt:1}).sort({title:1})
                if(!Object.keys(books).length){
                    return res.status(404).send({status:false,message:"No such book exist or Already Deleted"})
                }
                return res.status(200).send({status:true, message:"Book List",data:books})
        }
        return res.status(400).send({status:false,message:"Please Provide valid Query"})
    }
    }catch(error){
        return res.status(500).send({status:false, message:error.message})
    }
    }

    
//==================================get book by Id============================================= 
    
const getbooksbyId= async function(req,res){
try{
    let bookId=req.params.bookId
    if(!isValidObjectId(bookId)) return res.status(400).send({status:false,message:"Please provide valid userId"})
    
    const findId=await bookModel.findById({_id:bookId})
    if(findId.isDeleted) return res.status(404).send({status:false,message:"No book exist with this Id or Already deleted"})
  
    const review= await reviewModel.find(findId)
    
    const details={
        _id:findId._id,
        title:findId.title,
        excerpt:findId.excerpt,
        userId:findId.userId,
        category:findId.category,
        subcategory:findId.subcategory,
        isDeleted:findId.isDeleted,
        releasedAt:findId.releasedAt,
        createdAt:findId.createdAt,
        updatedAt:findId.updatedAt,
        reviewData:review
    }

    return res.status(200).send({status:true,message:"book List", data: details})
}catch(error){
    return res.status(500).send({status:false,message:error.message})
}
}

// =============================PUT /books/:bookId=====================================================

const updateBookById = async (req, res) => {
    try {
        let bookId = req.params.bookId;
        let body = req.body
        let { title, excerpt, releasedAt, ISBN, ...rest } = body
        
        if (!checkInputsPresent(body)) return res.status(400).send({ status: false, message: "please provide some details(i.e. title, excerpt, releasedAt, ISBN) to update !!!" });
        if (checkInputsPresent(req.query)) { return res.status(400).send({ status: false, message: "You can't put anything in Query" }) }
        if (checkInputsPresent(rest)) { return res.status(400).send({ status: false, message: "You can put only title or excerpt or releasedAt or ISBN." }) }
        
        
        if (body.hasOwnProperty('title') && !checkString(title)) return res.status(400).send({ status: false, message: "Please Provide Title." })
        if (title && !validateTName(title)) return res.status(400).send({ status: false, message: "Invalid Title." });
        
        if (body.hasOwnProperty('excerpt') && !checkString(excerpt)) return res.status(400).send({ status: false, message: "Please Provide Excerpt." })
        if (excerpt && !validateName(excerpt)) return res.status(400).send({ status: false, message: "Invalid Excerpt." });
        
        
        if (body.hasOwnProperty('ISBN') && !checkString(ISBN)) return res.status(400).send({ status: false, message: "Please Provide ISBN." })
        if (ISBN && !validateISBN(ISBN)) return res.status(400).send({ status: false, message: "Invalid ISBN." });
        
        
        if (body.hasOwnProperty('releasedAt') && !validateDate(releasedAt)) return res.status(400).send({ status: false, message: "Invalid Date Format. You should use this format (YYYY-MM-DD)" });
        
   
        let uniqueTitle = await bookModel.findOne({ title: title })
        if (uniqueTitle) { return res.status(404).send({ status: false, message: `This Title: ${title} is already Present. Please use Another Title.` }) }
        
        
        let uniqueISBN = await bookModel.findOne({ ISBN: ISBN })
        if (uniqueISBN) { return res.status(404).send({ status: false, message: `This ISBN: ${ISBN} is already Present. Please use Another ISBN.` }) }
        
        
        let updateBook = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, body, { new: true })

      
        if (!updateBook) { return res.status(404).send({ status: false, message: "No Document Found! Book Updation Unsuccessful" }) }

        res.status(200).send({ status: true, message: 'Success', data: updateBook })

    } catch (error) {
        
        res.status(500).send({ status: 'error', error: error.message })
    }
}

// // ===============================DELETE /books/:bookId===============================================
    
let deleteBook = async function (req, res) {
    try {
        const bookId = req.params.bookId
      
       let deletedBook = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false, deletedAt: null },
            { isDeleted: true, deletedAt: new Date() }, { new: true })
        if (!deletedBook) {
            return  res.status(404).send({ status: false, msg: "either the book is already deleted" })
            
        }
        return res.status(200).send({ status: true, msg: "Book has been deleted" ,data:deleteBook})
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
};

module.exports={getbooks , createBook,getbooksbyId,updateBookById,deleteBook}

