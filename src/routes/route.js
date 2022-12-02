const express= require('express')
const router= express.Router()
const userController = require("../controller/userController")
const bookController = require("../controller/bookController")
const middleware=require("../middleware/auth")
const createReview = require('../controller/reviewController')



router.post("/register",userController.createUser)

router.post("/login",userController.login)

router.post("/books",middleware.Authentication,middleware.Authorisation,bookController.createBook)

router.get("/books",middleware.Authentication,bookController.getbooks)

router.get("/books/:bookId",middleware.Authentication,bookController.getbooksbyId)

router.put("/books/:bookId",middleware.Authentication,middleware.Authorisation,bookController.updateBookById)

router.delete("/books/:bookId",middleware.Authentication,middleware.Authorisation,bookController.deleteBook)

router.post("/books/:bookId/review", createReview.createReview)

router.put("/books/:bookId/review/:reviewId", createReview.updateReview)

router.delete("/books/:bookId/review/:reviewId", createReview.deletereview)

module.exports= router;