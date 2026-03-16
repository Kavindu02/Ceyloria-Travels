import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import { FaCloudUploadAlt, FaPlus, FaTrash } from "react-icons/fa";
import mediaUpload from "../../utils/mediaUpload";

// Import React Quill
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; // standard CSS for Quill

export default function AddBlogAdminPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        excerpt: "",
        content: "",
        image: "",
        images: [],
        category: "",
        author: "Ceyloria Team",
        anchor: "",
        link: "",
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Quill Toolbar Configuration
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }], // Heading sizes
            [{ size: ['small', false, 'large', 'huge'] }], // Font sizes
            [{ font: [] }], // Fonts
            ['bold', 'italic', 'underline', 'strike', 'blockquote'], // Formatting
            [{ align: [] }], // Alignment
            [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }], // Lists & Indentation
            ['link', 'image', 'video'], // Media
            [{ color: [] }, { background: [] }], // Colors
            ['clean'] // Remove formatting
        ],
    };

    const formats = [
        'header', 'size', 'font',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'align', 'list', 'bullet', 'indent',
        'link', 'image', 'video', 'color', 'background'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            // Auto-generate anchor and link if title changes
            ...(name === "title" && {
                anchor: value.toLowerCase().replace(/[^a-z0-9]/g, "-"),
                link: "/" + value.toLowerCase().replace(/[^a-z0-9]/g, "-"),
            }),
        }));
    };

    // Special handler for Quill since it passes the value directly, not an event
    const handleContentChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            content: value,
        }));
    };

    const handleImageUpload = async (e, type, index = null) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const toastId = toast.loading("Uploading image...");

        try {
            const url = await mediaUpload(file);
            
            if (type === 'main') {
                setFormData(prev => ({ ...prev, image: url }));
            } else if (type === 'extra' && index !== null) {
                const newImages = [...formData.images];
                newImages[index] = url;
                setFormData(prev => ({ ...prev, images: newImages }));
            }
            
            toast.success("Image uploaded!", { id: toastId });
        } catch (err) {
            console.error("Upload failed:", err);
            toast.error("Upload failed. Please try again.", { id: toastId });
        } finally {
            setUploading(false);
        }
    };

    const addExtraImageField = () => {
        if (formData.images.length >= 3) {
            toast.error("Maximum 3 extra images allowed.");
            return;
        }
        setFormData(prev => ({ ...prev, images: [...prev.images, ""] }));
    };

    const removeExtraImageField = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            
            // Filter out empty images before sending to backend
            const payload = {
                ...formData,
                images: formData.images.filter(img => img && img.trim() !== "")
            };
            
            await axios.post(import.meta.env.VITE_BACKEND_URL + "/blogs", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Blog created successfully!");
            navigate("/admin/blogs");
        } catch (err) {
            console.error("Error creating blog:", err);
            toast.error(err.response?.data?.message || "Failed to create blog");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <button
                onClick={() => navigate("/admin/blogs")}
                className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors font-medium"
            >
                <FaArrowLeft /> Back to Blogs
            </button>

            <div>
                <h1 className="text-3xl font-bold text-white">Add New Blog</h1>
                <p className="text-slate-400">Share a new adventure with your readers</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300">Blog Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Hidden Gems of Sigiriya"
                            className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white focus:border-teal-500 outline-none transition"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300">Category *</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white focus:border-teal-500 outline-none transition"
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="City Guide">City Guide</option>
                            <option value="Nature">Nature</option>
                            <option value="Heritage">Heritage</option>
                            <option value="Coastal">Coastal</option>
                            <option value="Adventure">Adventure</option>
                            <option value="Culture">Culture</option>
                        </select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-300">Main Cover Image *
                         {uploading && <span className="ml-2 text-yellow-500 text-xs">(Uploading...)</span>}
                        </label>
                        <div className="flex items-start gap-4">
                            {formData.image ? (
                                <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-slate-700">
                                    <img src={formData.image} alt="Hero" className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="w-32 h-20 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center text-slate-500">
                                    <span className="text-xs">No Image</span>
                                </div>
                            )}

                            <label className="cursor-pointer bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors">
                                <FaCloudUploadAlt /> 
                                <span>{formData.image ? "Change Image" : "Upload Image"}</span>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, 'main')} 
                                    className="hidden" 
                                    disabled={uploading}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="space-y-4 md:col-span-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-slate-300">Extra Images (Max 3)</label>
                            <button
                                type="button"
                                onClick={addExtraImageField}
                                disabled={formData.images.length >= 3}
                                className="text-xs bg-slate-800 border border-slate-700 hover:bg-slate-700 text-teal-400 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <img src="/admin-add-icon.svg" alt="add" className="w-4 h-4" /> Add Image
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                             {formData.images.map((img, index) => (
                                <div key={index} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 relative group flex flex-col items-center justify-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => removeExtraImageField(index)}
                                        className="absolute top-2 right-2 p-1.5 text-slate-500 hover:text-red-500 transition-colors bg-slate-900 rounded-lg border border-slate-700"
                                    >
                                        <FaTrash size={12} />
                                    </button>
                                     {img ? (
                                        <div className="relative w-full h-24 rounded-lg overflow-hidden border border-slate-700">
                                            <img src={img} alt={`Extra ${index + 1}`} className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-full h-24 bg-slate-900 rounded-lg border border-slate-700 border-dashed flex items-center justify-center text-slate-600">
                                            <span className="text-xs">No Image</span>
                                        </div>
                                    )}

                                    <label className="block w-full cursor-pointer bg-slate-900 border border-slate-700 hover:border-teal-500 text-slate-400 hover:text-white px-3 py-2 rounded text-xs text-center transition-colors">
                                        {uploading ? "Uploading..." : (img ? "Change" : "Upload")}
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, 'extra', index)} 
                                            className="hidden" 
                                            disabled={uploading}
                                        />
                                    </label>
                                </div>
                             ))}
                        </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-300">Excerpt / Short Description *</label>
                        <textarea
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                            placeholder="A brief summary of the blog post..."
                            className="w-full h-32 rounded-xl bg-slate-800 border border-white/10 p-4 text-white focus:border-teal-500 outline-none transition resize-none"
                            required
                        ></textarea>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-300">Detailed Blog Content (Rich Text) *</label>
                        <div className="bg-white text-black rounded-xl overflow-hidden border border-white/10">
                             <ReactQuill 
                                 theme="snow"
                                 value={formData.content} 
                                 onChange={handleContentChange} 
                                 modules={modules}
                                 formats={formats}
                                 className="h-64 mb-12"
                                 placeholder="Write your completely styled story here..."
                             />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300">Author</label>
                        <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white focus:border-teal-500 outline-none transition"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300">Anchor ID (for smooth scroll)</label>
                        <input
                            type="text"
                            name="anchor"
                            value={formData.anchor}
                            onChange={handleChange}
                            className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white focus:border-teal-500 outline-none transition"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300">Target Detail Link (e.g. /colombo)</label>
                        <input
                            type="text"
                            name="link"
                            value={formData.link}
                            onChange={handleChange}
                            className="w-full h-12 rounded-xl bg-slate-800 border border-white/10 px-4 text-white focus:border-teal-500 outline-none transition"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || uploading || !formData.content}
                    className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-lg hover:shadow-lg hover:shadow-blue-600/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading ? "Creating Post..." : <><img src="/admin-add-icon.svg" alt="add" className="w-5 h-5" /> Publish Blog Post</>}
                </button>
            </form>
        </div>
    );
}
