const express=require("express")
const router=express.Router()
const AuthorController=require('../controller/authorController')

router.post("/author", AuthorController.createAuthor)

module.exports=router