const Blog = require("../models/blog.js");

exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.findAll({ order: [['createdAt', 'DESC']] });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch blogs", error: error.message });
    }
};

exports.createBlog = async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.status(201).json({ message: "Blog created successfully", blog: newBlog });
    } catch (error) {
        res.status(500).json({ message: "Failed to create blog", error: error.message });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const [updatedRows] = await Blog.update(req.body, { where: { id: req.params.id } });
        if (updatedRows === 0) return res.status(404).json({ message: "Blog not found" });
        const updatedBlog = await Blog.findByPk(req.params.id);
        res.json({ message: "Blog updated successfully", blog: updatedBlog });
    } catch (error) {
        res.status(500).json({ message: "Failed to update blog", error: error.message });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const deletedRows = await Blog.destroy({ where: { id: req.params.id } });
        if (deletedRows === 0) return res.status(404).json({ message: "Blog not found" });
        res.json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete blog", error: error.message });
    }
};

exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch blog", error: error.message });
    }
};
