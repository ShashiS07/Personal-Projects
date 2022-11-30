
const reviewModel = require('../model/reviewModel')
const bookModel = require('../model/bookModel')
const ObjectId = require('mongoose').Types.ObjectId
const { checkInputsPresent, checkString, validateName,validateRating } = require('../validator/validator')
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

        updateBookData._doc.reviewData = details

        res.status(201).send({ status: true, message: "Success", data: updateBookData })

    } catch (error) {

        res.status(500).send({ status: 'error', error: error.message })
    }

}
//-------------------update review-------------------------------------------------


//-------------------update review-------------------------------------------------
const updateReview = async function (req, res) {
    try {
        const bookId = req.params.bookId;
        const reviewId = req.params.reviewId
        const data = req.body
        const { review, rating, reviewedBy } = data;
    
    
        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, msg: "userId not valid" })
        }
        if (!isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, msg: " reviewId not valid" })
        }
        if (!checkInputsPresent(data)) {
            return res.status(400).send({ status: false, msg: "please provide some data to update review" })
        }
    
         let Obj1={}
    
             
            if(reviewedBy){
                if (!validateName(reviewedBy)) {
                    return res.status(400).send({ status: false, msg: "reviewerName should be in proper format" })
                }
                 if(!validateName(reviewedBy))
                 return res.status(400).send({ status: false, msg: "reviewerName is invalid" })
               
                    Obj1.reviewedBy=reviewedBy
            }
          
      
        if (!rating) {
            return res.status(400).send({ status: false, msg: "rating is required" })
        }
       
        if((rating<1 || rating>5) || typeof(rating)!=='number') return res.status(400).send({status:false,message:"Please enter valid rating (number) in between range (1 to 5)."})
    
        
        Obj1.rating=rating
    
          Obj1.review=review
    
       
        const findBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!findBook) {
            return res.status(404).send({ status: false, msg: " book not found" })
        }
        const findReview = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!findReview) {
            return res.status(404).send({ status: false, msg: "review does not exist" })
        }
        if (findReview.bookId != bookId) {
            return res.status(404).send({ status: false, message: "Review not found for this book" })
        }
    
        const updatedReviews = await reviewModel.findOneAndUpdate({ _id: reviewId,isDeleted:false }, { $set: Obj1 }, { new: true }).select({deletedAt:0})
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

    const checkbook= await bookModel.findById({_id:bookId})
    if(!checkbook) return res.status(404).send({status:false,message:"No Book exist with this Id"})
    if(checkbook.isDeleted) return res.status(200).send({status:false,message:"Book Already deleted"})

    if(checkbook.reviews==0) return res.status(200).send({status:true,message:"No reviews till now"})

    const checkreview= await reviewModel.findById({_id:reviewId})
    if(!checkreview) return res.status(404).send({status:false,message:"No reviews with this Id"})
    if(checkreview.isDeleted) return res.status(200).send({status:false,message:"Review is already deleted"})

    const deletereviewdata= await reviewModel.findOneAndUpdate(
        {_id:reviewId},
        {$set:{isDeleted:true}});

    const countreview= await bookModel.findOneAndUpdate(
        {_id:bookId},
        { $inc: { reviews: -1 } })

    return res.status(200).send({status:true,message:"review deleted Successfully"})
}catch(error){
    return res.status(500).send({status:false,message:error.message})
}
}


module.exports={createReview,deletereview,updateReview}