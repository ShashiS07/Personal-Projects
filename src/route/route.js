const express=require("express")
const router=express.Router()
const AuthorController=require('../controller/authorController')
const BlogController=require('../controller/blogController')
const Auth=require('../Middleware/authentication')

router.post("/authors", AuthorController.createAuthor)

router.post("/login", AuthorController.login)

router.post("/blogs",Auth.authentication, BlogController.createblog)

router.get("/blogs", Auth.authentication, BlogController.getBlogs)

router.put("/blogs/:blogId",Auth.authentication, Auth.authorization , BlogController.updateBlogs)

router.delete("/blogs/:blogId",Auth.authentication, Auth.authorization , BlogController.deletedBlog)

router.delete("/blogs",Auth.authentication, BlogController.deletebyquery)



module.exports=router