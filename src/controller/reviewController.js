
const reviewModel = require('../model/reviewModel')
const bookModel = require('../model/bookModel')
const ObjectId = require('mongoose').Types.ObjectId
const { checkInputsPresent, checkString, validateName } = require('../validator/validator')

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
module.exports={createReview}