const express=require("express")
const router=express.Router()
const AuthorController=require('../controller/authorController')
const BlogController=require('../controller/blogController')

router.post("/author", AuthorController.createAuthor)

router.post("/blog", BlogController.createblog)

router.get("/getblog", BlogController.getBlogs)


module.exports=router