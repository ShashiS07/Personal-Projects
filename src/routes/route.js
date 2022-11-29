const express= require('express')
const router= express.Router()
const userController = require("../controller/userController")
const bookController = require("../controller/bookController")
const auth=require("../middleware/auth")


router.post("/register",userController.createUser)
router.post("/login",userController.login)
router.post("/books",bookController.createBook)
router.get("/books",bookController.getbooks)
router.get("/books/:bookId",bookController.getbooksbyId)




module.exports= router;