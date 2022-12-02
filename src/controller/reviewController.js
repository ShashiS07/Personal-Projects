
const reviewModel = require('../model/reviewModel')
const bookModel = require('../model/bookModel')
const ObjectId = require('mongoose').Types.ObjectId
const { checkInputsPresent, checkString, validateName,isvalidName } = require('../validator/validator')
const{isValidObjectId}=require("mongoose")

const createReview = async (req, res) => {
    try {

        let BookId = req.params.bookId
        let data = req.body

        let { review, rating, reviewedBy, ...rest } = data

        
        if (!ObjectId.isValid(BookId)) { return res.status(400).send({ status: false, message: `This BookId: ${BookId} is not Valid.` }) }

        if (!checkInputsPresent(data)) { return res.status(400).send({ status: false, message: "Please Provide Details to Create Review." }) }
        if (checkInputsPresent(rest)) { return res.status(400).send({ status: false, message: "You have to put only review & rating & reviewedBy,." }) }

    
        let checkBookId = await bookModel.findOne({ _id: BookId, isDeleted: false })
        if (!checkBookId) { return res.status(400).send({ status: false, message: `Book with this ${BookId} is not Exist or already been deleted.` }) }

        if (data.hasOwnProperty('reviewedBy')) {
            if (!checkString(reviewedBy) || !validateName(reviewedBy)) return res.status(400).send({ status: false, message: "Please Provide Valid Name in reviewedBy or Delete the key()." });
        }

        if (data.hasOwnProperty('review')) {
            if (!checkString(review) || !validateName(review)) return res.status(400).send({ status: false, message: "Please Provide Valid Review." });
        }

       
        if (data.hasOwnProperty('rating')) {
            if ((typeof rating !== "number") || (rating === 0) || !(rating >= 1 && rating <= 5)) {
                return res.status(400).send({ status: false, message: "Please enter valid rating (number) in between range (1 to 5)." });
            }
        }

        if (!rating) { return res.status(400).send({ status: false, message: "Please enter Book rating(required)" }) }

        data.bookId = BookId
        data.reviewedAt = Date.now()

        let createReview = await reviewModel.create(data)

        let updateBookData = await bookModel.findByIdAndUpdate({ _id: BookId }, { $inc: { reviews: 1 } }, { new: true })

        let details = {
            _id: createReview._id,
            bookId: BookId,
            reviewedBy: createReview.reviewedBy,
            reviewedAt: createReview.reviewedAt,
            rating: createReview.rating,
            review: createReview.review
        }

        updateBookData._doc.reviewsData = details

        res.status(201).send({ status: true, message: "Review added successfully", data: updateBookData })

    } catch (error) {

        res.status(500).send({ status: 'error', error: error.message })
    }

}

//-------------------update review-------------------------------------------------
const updateReview = async function (req, res) {
    try {
        const bookId = req.params.bookId;
        const reviewId = req.params.reviewId
        const data = req.body
        const { review, rating, reviewedBy } = data;
    
    
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, msg: "bookId not valid" })  
        if (!isValidObjectId(reviewId)) return res.status(400).send({ status: false, msg: " reviewId not valid" })
       
        
        if (!checkInputsPresent(data))  return res.status(400).send({ status: false, msg: "please provide some data to update review" })
        
         let Obj1={}         
            if(reviewedBy){
                if (!validateName(reviewedBy)) {
                    return res.status(400).send({ status: false, msg: "reviewerName should be in proper format" })
                }
    
                    Obj1.reviewedBy=reviewedBy
            }
           
       if(rating){
        if((rating<1 || rating>5) || typeof(rating)!=='number') return res.status(400).send({status:false,message:"Please enter valid rating (number) in between range (1 to 5)."})
        Obj1.rating=rating
       }
        
       if(review){
        if(!isvalidName(review)) return res.status(400).send({status:false,message:"please provide valid review"})
        Obj1.review=review
       }
        
        const findBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!findBook) {
            return res.status(404).send({ status: false, msg: " book not found" })
        }
      
        const updatedReviews = await reviewModel.findOneAndUpdate({ _id: reviewId,bookId:bookId,isDeleted:false }, { $set: Obj1 }, { new: true }).select({deletedAt:0})
        if(!updatedReviews) return res.status(404).send({status:true,message:"review does not present in this book"})
        return res.status(200).send({ status: true, message: "Successfully updated the review of the book.", data: findBook, updatedReviews })
    

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
// =================================delete review========================================
const deletereview= async function(req,res){
    try{
        let bookId=req.params.bookId
        if(!isValidObjectId(bookId)) return res.status(400).send({status:false,messgage:"Please Provide valid BookId"})
    
        let reviewId=req.params.reviewId
        if(!isValidObjectId(reviewId)) return res.status(400).send({status:false,message:"Please Provide valid review Id"})
    
        const deletereviewdata= await reviewModel.findOneAndUpdate({_id:reviewId,bookId:bookId,isDeleted:false},{$set:{isDeleted:true}});
        if(!deletereviewdata) return res.status(404).send({status:false,message:"No reviews with this Id or Review is already deleted "})
        
    
        const countreview= await bookModel.findOneAndUpdate({_id:bookId,isDeleted:false},{ $inc: { reviews: -1 } })
        if(!countreview) return res.status(404).send({status:false,message:"Book not found or book already deleted"})
        return res.status(200).send({status:true,message:"review deleted Successfully"})
    } catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
    }

module.exports={createReview,deletereview,updateReview}