const express = require("express");
const {
    getBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
    getBlogById,
} = require("../controllers/blogController.js");

const blogRouter = express.Router();

blogRouter.get("/", getBlogs);
blogRouter.get("/:id", getBlogById);
blogRouter.post("/", createBlog);
blogRouter.put("/:id", updateBlog);
blogRouter.delete("/:id", deleteBlog);

module.exports = blogRouter;
