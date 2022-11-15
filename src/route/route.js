const express=require("express")
const router=express.Router()
const AuthorController=require('../controller/authorController')
const BlogController=require('../controller/blogController')

router.post("/authors", AuthorController.createAuthor)

router.post("/blogs", BlogController.createblog)

router.get("/blogs", BlogController.getBlogs)

router.delete("/blogs",BlogController.deletebyquery)


module.exports=router