import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { RiArticleLine, RiDeleteBin6Line, RiEdit2Line, RiAddLine } from "react-icons/ri";

export default function BlogAdminPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBlogs = async () => {
        try {
            const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "/blogs");
            setBlogs(res.data);
        } catch (err) {
            console.error("Error fetching blogs:", err);
            toast.error("Failed to load blogs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const deleteBlog = async (id, title) => {
        if (!confirm(`Are you sure you want to delete blog: ${title}?`)) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(import.meta.env.VITE_BACKEND_URL + `/blogs/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Blog deleted successfully");
            fetchBlogs();
        } catch (err) {
            console.error("Error deleting blog:", err);
            toast.error("Failed to delete blog");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Manage Blogs</h1>
                    <p className="text-slate-400">View and manage your travel journal posts</p>
                </div>
                <Link
                    to="/admin/add-blog"
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-600/20 transition"
                >
                    <img src="/admin-add-icon.svg" alt="add" className="w-5 h-5" />
                    Add New Blog
                </Link>
            </div>

            <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="p-10 text-center text-slate-400">Loading blogs...</div>
                ) : blogs.length === 0 ? (
                    <div className="p-10 text-center text-slate-400">No blogs found. Start by adding one!</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-800 text-slate-300 text-sm uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Image</th>
                                    <th className="px-6 py-4 font-semibold">Title</th>
                                    <th className="px-6 py-4 font-semibold">Category</th>
                                    <th className="px-6 py-4 font-semibold">Author</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {blogs.map((blog) => (
                                    <tr key={blog.id} className="hover:bg-white/5 transition">
                                        <td className="px-6 py-4">
                                            <img
                                                src={blog.image}
                                                alt={blog.title}
                                                className="w-16 h-12 object-cover rounded-lg"
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-medium text-white">{blog.title}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-teal-500/10 text-teal-400 text-xs font-bold rounded-full">
                                                {blog.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">{blog.author}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    to={`/admin/update-blog/${blog.id}`}
                                                    className="p-2 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition"
                                                >
                                                    <RiEdit2Line />
                                                </Link>
                                                <button
                                                    onClick={() => deleteBlog(blog.id, blog.title)}
                                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition"
                                                >
                                                    <RiDeleteBin6Line />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
