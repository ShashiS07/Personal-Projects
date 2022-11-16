const express=require("express")
const router=express.Router()
const AuthorController=require('../controller/authorController')
const BlogController=require('../controller/blogController')
const Authentication=require('../Middleware/authentication')

router.post("/authors", AuthorController.createAuthor)

router.post("/login", AuthorController.login)

router.post("/blogs",Authentication.authentication, BlogController.createblog)

router.get("/blogs", Authentication.authentication, BlogController.getBlogs)

router.put("/blogs/:blogId",Authentication.authentication, Authentication.authorization , BlogController.updateBlogs)

router.delete("/blogs/:blogId",Authentication.authentication, BlogController.deletedBlog)

router.delete("/blogs",Authentication.authentication,BlogController.deletebyquery)



module.exports=router